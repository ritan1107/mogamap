import json
import re
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


START_URL = "https://u-word.com/teppan/store/searchResult"
BASE_URL = "https://u-word.com"


def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()


def normalize_phone(value):
    value = clean(value)
    value = value.replace("ー", "-").replace("‐", "-").replace("−", "-")
    return value


def get_jsonld_items(soup):
    items = []

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or script.get_text())

            if isinstance(data, list):
                items.extend(data)

            elif isinstance(data, dict):
                if "@graph" in data and isinstance(data["@graph"], list):
                    items.extend(data["@graph"])
                else:
                    items.append(data)

        except Exception:
            pass

    return items


def address_from_jsonld(soup):
    for item in get_jsonld_items(soup):
        if not isinstance(item, dict):
            continue

        address = item.get("address")

        if isinstance(address, dict):
            parts = [
                address.get("postalCode", ""),
                address.get("addressRegion", ""),
                address.get("addressLocality", ""),
                address.get("streetAddress", "")
            ]

            result = clean(" ".join(x for x in parts if x))

            if result:
                return result

        elif isinstance(address, str):
            result = clean(address)

            if result:
                return result

    return ""


def phone_from_jsonld(soup):
    for item in get_jsonld_items(soup):
        if not isinstance(item, dict):
            continue

        tel = item.get("telephone")

        if tel:
            return normalize_phone(str(tel))

    return ""


def find_address(soup, text):
    # 1. 構造化データ
    address = address_from_jsonld(soup)

    if address:
        return address

    # 2. <address> タグ
    tag = soup.find("address")

    if tag:
        value = clean(tag.get_text(" ", strip=True))

        if value:
            return value

    # 3. 「住所」「所在地」の直後
    labels = soup.find_all(
        string=re.compile(r"住所|所在地|店舗住所|ショップ住所")
    )

    for label in labels:
        parent = label.parent

        if parent:
            candidates = [
                parent.get_text(" ", strip=True),
                parent.parent.get_text(" ", strip=True)
                if parent.parent else ""
            ]

            for candidate in candidates:
                candidate = clean(candidate)

                match = re.search(
                    r"(?:住所|所在地|店舗住所|ショップ住所)"
                    r"[\s：:]*"
                    r"(〒?\s*\d{3}-?\d{4}\s*)?"
                    r"(北海道[^|｜\n]{3,120})",
                    candidate
                )

                if match:
                    postal = match.group(1) or ""
                    return clean(postal + match.group(2))

    # 4. 郵便番号 + 北海道
    match = re.search(
        r"(〒?\s*\d{3}-?\d{4}\s*北海道.{3,100}?)"
        r"(?=TEL|電話|営業時間|定休日|アクセス|MAP|地図|$)",
        text,
        re.IGNORECASE
    )

    if match:
        return clean(match.group(1))

    # 5. 北海道から始まる住所
    match = re.search(
        r"(北海道(?:札幌市|函館市|小樽市|旭川市|室蘭市|釧路市|"
        r"帯広市|北見市|夕張市|岩見沢市|網走市|留萌市|苫小牧市|"
        r"稚内市|美唄市|芦別市|江別市|赤平市|紋別市|士別市|"
        r"名寄市|三笠市|根室市|千歳市|滝川市|砂川市|歌志内市|"
        r"深川市|富良野市|登別市|恵庭市|伊達市|北広島市|"
        r"石狩市|北斗市|[^ ]+郡)[^|｜\n]{3,100})",
        text
    )

    if match:
        return clean(match.group(1))

    return ""


def find_phone(soup, text):
    # 1. tel:リンクが最優先
    tel_link = soup.find("a", href=re.compile(r"^tel:", re.I))

    if tel_link:
        value = tel_link.get("href", "")[4:]

        if value:
            return normalize_phone(value)

    # 2. JSON-LD
    value = phone_from_jsonld(soup)

    if value:
        return value

    # 3. テキストから電話番号
    patterns = [
        r"(?:TEL|電話|電話番号)[\s：:]*"
        r"(0\d{1,4}[-ー‐−]\d{1,4}[-ー‐−]\d{3,4})",

        r"(0\d{1,4}[-ー‐−]\d{1,4}[-ー‐−]\d{3,4})"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.I)

        if match:
            return normalize_phone(match.group(1))

    return ""


def get_name(soup):
    # JSON-LD
    for item in get_jsonld_items(soup):
        if isinstance(item, dict):
            item_type = item.get("@type", "")

            if isinstance(item_type, list):
                item_type = " ".join(item_type)

            if any(
                x in str(item_type).lower()
                for x in [
                    "restaurant",
                    "localbusiness",
                    "store",
                    "foodestablishment"
                ]
            ):
                name = clean(item.get("name", ""))

                if name:
                    return name

    # h1
    h1 = soup.find("h1")

    if h1:
        name = clean(h1.get_text(" ", strip=True))

        if name:
            return name

    # og:title
    og = soup.find("meta", property="og:title")

    if og and og.get("content"):
        return clean(og["content"])

    return ""


def get_description(soup):
    og = soup.find("meta", property="og:description")

    if og and og.get("content"):
        return clean(og["content"])

    meta = soup.find("meta", attrs={"name": "description"})

    if meta and meta.get("content"):
        return clean(meta["content"])

    return ""


def get_image(soup):
    og = soup.find("meta", property="og:image")

    if og and og.get("content"):
        return urljoin(BASE_URL, og["content"])

    img = soup.find("img")

    if img and img.get("src"):
        return urljoin(BASE_URL, img["src"])

    return ""


def is_candidate_url(url):
    parsed = urlparse(url)

    if not parsed.netloc.endswith("u-word.com"):
        return False

    path = parsed.path.lower()

    # 明らかに店舗詳細ではないURLを除外
    blocked = [
        "/login",
        "/signup",
        "/contact",
        "/privacy",
        "/terms",
        "/news",
        "/about",
        "/assets/",
        "/wp-",
        "/teppan"
    ]

    if path in ["/", "/teppan"]:
        return False

    if any(x in path for x in blocked):
        return False

    return True


def main():
    stores = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context = browser.new_context(
            viewport={"width": 1280, "height": 1800},
            user_agent=(
                "Mozilla/5.0 "
                "(Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 "
                "(KHTML, like Gecko) "
                "Chrome/126 Safari/537.36"
            )
        )

        page = context.new_page()

        print("Loading:", START_URL)

        page.goto(
            START_URL,
            wait_until="domcontentloaded",
            timeout=60000
        )

        page.wait_for_timeout(5000)

        # 遅延読み込み対策
        last_height = 0

        for _ in range(15):
            page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )

            page.wait_for_timeout(1000)

            height = page.evaluate("document.body.scrollHeight")

            if height == last_height:
                break

            last_height = height

        hrefs = page.eval_on_selector_all(
            "a[href]",
            "els => els.map(a => a.href)"
        )

        urls = []

        for href in hrefs:
            if not href:
                continue

            href = href.split("#")[0]

            if is_candidate_url(href):
                urls.append(href)

        urls = sorted(set(urls))

        print("Candidate URLs:", len(urls))

        detail = context.new_page()

        for index, url in enumerate(urls, 1):
            try:
                print(f"[{index}/{len(urls)}] Opening:", url)

                detail.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=60000
                )

                detail.wait_for_timeout(2500)

                html = detail.content()

                soup = BeautifulSoup(
                    html,
                    "html.parser"
                )

                text = clean(
                    soup.get_text(" ", strip=True)
                )

                name = get_name(soup)

                if not name:
                    continue

                address = find_address(
                    soup,
                    text
                )

                phone = find_phone(
                    soup,
                    text
                )

                # 北海道住所が取れない店舗は
                # 北海道版もがマップには入れない
                if not address:
                    print(
                        "SKIP no address:",
                        name
                    )
                    continue

                if "北海道" not in address:
                    print(
                        "SKIP outside Hokkaido:",
                        name,
                        address
                    )
                    continue

                store = {
                    "name": name,
                    "address": address,
                    "phone": phone,
                    "description": get_description(soup),
                    "image": get_image(soup),
                    "source_url": url,
                    "source": "U-WORD てっぱん"
                }

                stores.append(store)

                print(
                    "STORE:",
                    name,
                    "|",
                    address,
                    "|",
                    phone
                )

            except Exception as e:
                print(
                    "ERROR:",
                    url,
                    str(e)
                )

        browser.close()

    # URL単位で重複除去
    unique = {}

    for store in stores:
        unique[store["source_url"]] = store

    stores = list(unique.values())

    # 店名順
    stores.sort(
        key=lambda x: x["name"]
    )

    print(
        "Hokkaido stores found:",
        len(stores)
    )

    # 0件なら既存JSONを壊さない
    if not stores:
        print(
            "No Hokkaido stores found. "
            "stores.json was not overwritten."
        )
        return

    with open(
        "stores.json",
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            stores,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(
        "Saved stores.json:",
        len(stores)
    )


if __name__ == "__main__":
    main()
