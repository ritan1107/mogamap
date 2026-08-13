import json
import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


START_URL = "https://u-word.com/teppan/store/searchResult"
BASE_URL = "https://u-word.com"
OUTPUT_FILE = "stores.json"


def clean(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def normalize_phone(value):
    value = clean(value)
    value = value.replace("−", "-").replace("ー", "-").replace("―", "-")
    return value


def find_store_urls(text):
    urls = set()

    patterns = [
        r'["\']?(/teppan/store/storeDetail/\d+)["\']?',
        r'https?://u-word\.com/teppan/store/storeDetail/\d+',
    ]

    for pattern in patterns:
        for match in re.findall(pattern, text or ""):
            urls.add(urljoin(BASE_URL, match))

    return urls


def collect_store_urls(page):
    found = set()

    # 通信で返ってくるURLも確認
    def inspect_response(response):
        try:
            url = response.url
            found.update(find_store_urls(url))

            content_type = response.headers.get("content-type", "")
            if "json" in content_type or "text" in content_type or "html" in content_type:
                body = response.text()
                found.update(find_store_urls(body))
        except Exception:
            pass

    page.on("response", inspect_response)

    print("Loading:", START_URL)

    page.goto(
        START_URL,
        wait_until="domcontentloaded",
        timeout=60000
    )

    page.wait_for_timeout(5000)

    # スクロールして遅延読み込みを出す
    previous_height = 0

    for _ in range(15):
        try:
            current_height = page.evaluate("document.body.scrollHeight")

            page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )

            page.wait_for_timeout(1200)

            html = page.content()
            found.update(find_store_urls(html))

            hrefs = page.locator("a").evaluate_all(
                """els => els.map(a => a.href || a.getAttribute('href') || '')"""
            )

            for href in hrefs:
                found.update(find_store_urls(href))

            if current_height == previous_height:
                break

            previous_height = current_height

        except Exception as e:
            print("Scroll warning:", e)

    # ページ内scriptも直接確認
    try:
        scripts = page.locator("script").all_text_contents()
        for script in scripts:
            found.update(find_store_urls(script))
    except Exception:
        pass

    # 次へ・もっと見る系ボタンがあれば押してみる
    labels = [
        "次へ",
        "次のページ",
        "もっと見る",
        "さらに表示",
        "MORE",
        "Next",
    ]

    for label in labels:
        try:
            locator = page.get_by_text(label, exact=False)

            count = locator.count()

            for i in range(min(count, 5)):
                try:
                    locator.nth(i).click(timeout=2000)
                    page.wait_for_timeout(1500)

                    html = page.content()
                    found.update(find_store_urls(html))

                except Exception:
                    pass

        except Exception:
            pass

    html = page.content()
    found.update(find_store_urls(html))

    print("Candidate URLs:", len(found))

    for url in sorted(found):
        print("CANDIDATE:", url)

    return sorted(found)


def extract_address(soup):
    text = clean(soup.get_text(" ", strip=True))

    # 北海道から始まる住所を優先
    match = re.search(
        r"(北海道.{2,100}?)(?=TEL|電話|営業時間|定休日|アクセス|MAP|$)",
        text,
        re.IGNORECASE
    )

    if match:
        return clean(match.group(1))

    # 郵便番号の後ろ
    match = re.search(
        r"(?:〒?\s*\d{3}-?\d{4}\s*)?(北海道.{2,100})",
        text
    )

    if match:
        return clean(match.group(1))

    return ""


def extract_phone(soup):
    text = clean(soup.get_text(" ", strip=True))

    match = re.search(
        r"(?:TEL|電話)[：:\s]*"
        r"((?:0\d{1,4})[-ー−]?\d{1,4}[-ー−]?\d{3,4})",
        text,
        re.IGNORECASE
    )

    if match:
        return normalize_phone(match.group(1))

    tel = soup.select_one('a[href^="tel:"]')

    if tel:
        return normalize_phone(
            tel.get("href", "").replace("tel:", "")
        )

    return ""


def extract_name(soup):
    selectors = [
        "h1",
        "h2",
        ".store-name",
        ".shop-name",
        ".title",
    ]

    for selector in selectors:
        node = soup.select_one(selector)

        if node:
            value = clean(node.get_text(" ", strip=True))
            if value:
                return value

    if soup.title:
        title = clean(soup.title.get_text())
        title = re.sub(
            r"\s*[|｜\-–—]\s*HORBY.*$",
            "",
            title,
            flags=re.IGNORECASE
        )
        return title

    return ""


def extract_description(soup):
    meta = soup.select_one('meta[name="description"]')

    if meta and meta.get("content"):
        return clean(meta.get("content"))

    text = clean(soup.get_text(" ", strip=True))

    return text[:300]


def extract_image(soup, page_url):
    selectors = [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
    ]

    for selector in selectors:
        node = soup.select_one(selector)

        if node and node.get("content"):
            return urljoin(
                page_url,
                node.get("content")
            )

    image = soup.select_one("img[src]")

    if image:
        return urljoin(
            page_url,
            image.get("src")
        )

    return ""


def read_store(page, url):
    print("Opening:", url)

    try:
        page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=60000
        )

        page.wait_for_timeout(1500)

        soup = BeautifulSoup(
            page.content(),
            "html.parser"
        )

        name = extract_name(soup)
        address = extract_address(soup)

        print("STORE:", name)
        print("ADDRESS:", address)

        # 北海道だけ保存
        if "北海道" not in address:
            print("SKIP: Not Hokkaido")
            return None

        return {
            "name": name,
            "address": address,
            "phone": extract_phone(soup),
            "description": extract_description(soup),
            "image": extract_image(soup, url),
            "source_url": url,
            "source": "U-WORD てっぱん"
        }

    except Exception as e:
        print("STORE ERROR:", url, e)
        return None


def main():
    stores = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True
        )

        context = browser.new_context(
            locale="ja-JP",
            viewport={
                "width": 1440,
                "height": 1400
            },
            user_agent=(
                "Mozilla/5.0 "
                "(Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 "
                "(KHTML, like Gecko) "
                "Chrome/126.0 Safari/537.36"
            )
        )

        page = context.new_page()

        urls = collect_store_urls(page)

        for url in urls:
            store = read_store(page, url)

            if store:
                stores.append(store)

        browser.close()

    # URLで重複削除
    unique = {}

    for store in stores:
        unique[store["source_url"]] = store

    stores = list(unique.values())

    print("Hokkaido stores found:", len(stores))

    # 0件なら既存JSONを壊さない
    if not stores:
        print(
            "No Hokkaido stores found. "
            "stores.json was not overwritten."
        )
        return

    with open(
        OUTPUT_FILE,
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
