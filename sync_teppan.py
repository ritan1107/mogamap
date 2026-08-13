import json
import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


BASE_URL = "https://u-word.com"
SEARCH_URL = "https://u-word.com/teppan/store/searchResult"
OUTPUT_FILE = "stores.json"


def clean(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def absolute_url(url):
    if not url:
        return ""
    return urljoin(BASE_URL, url)


def extract_store_like_urls(html):
    found = set()

    patterns = [
        r'https?://u-word\.com/teppan/[^"\']+',
        r'/teppan/store/[^"\']+',
        r'/teppan/menu/[^"\']+',
    ]

    for pattern in patterns:
        for value in re.findall(pattern, html or ""):
            value = value.replace("&amp;", "&")
            found.add(absolute_url(value))

    return found


def choose_hokkaido(page):
    print("STEP 1: open search page")
    page.goto(
        SEARCH_URL,
        wait_until="domcontentloaded",
        timeout=60000
    )
    page.wait_for_timeout(3000)

    print("Current URL:", page.url)

    # 右上の「検索」を押して条件画面を開く
    try:
        page.get_by_text("検索", exact=True).last.click(timeout=5000)
        page.wait_for_timeout(1500)
        print("Opened search conditions")
    except Exception as e:
        print("Search button click warning:", e)

    # エリア「指定なし」を押す
    try:
        labels = page.get_by_text("指定なし", exact=True)
        print("指定なし count:", labels.count())

        if labels.count() > 0:
            labels.first.click(timeout=5000)
            page.wait_for_timeout(800)
    except Exception as e:
        print("Area selector warning:", e)

    # 北海道を選択
    try:
        hokkaido = page.get_by_text("北海道", exact=True)
        print("北海道 count:", hokkaido.count())

        if hokkaido.count() > 0:
            hokkaido.last.click(timeout=5000)
            page.wait_for_timeout(500)
    except Exception as e:
        print("Hokkaido click warning:", e)

    # OK
    try:
        page.get_by_text("OK", exact=True).click(timeout=5000)
        page.wait_for_timeout(1000)
        print("Hokkaido selected")
    except Exception as e:
        print("OK click warning:", e)

    # 条件画面の一番下へ
    try:
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
    except Exception:
        pass

    # 「検索する」「この条件で検索」などを押す
    clicked = False

    for text in [
        "検索する",
        "この条件で検索",
        "検索",
    ]:
        try:
            locator = page.get_by_text(text, exact=True)

            if locator.count() > 0:
                locator.last.click(timeout=4000)
                clicked = True
                print("Clicked:", text)
                page.wait_for_timeout(5000)
                break
        except Exception:
            pass

    if not clicked:
        print("Could not find final search button")

    print("After search URL:", page.url)
    print("After search title:", page.title())


def collect_result_data(page):
    print("STEP 2: inspect search results")

    # 上へ戻す
    try:
        page.evaluate("window.scrollTo(0, 0)")
    except Exception:
        pass

    page.wait_for_timeout(1000)

    body_text = clean(page.locator("body").inner_text())

    print("BODY START:", body_text[:700])

    match = re.search(r"検索結果を\s*(\d+)\s*店舗表示", body_text)

    if match:
        print("RESULT COUNT:", match.group(1))
    else:
        print("RESULT COUNT: not detected")

    # 「店舗リスト表示」へ切替
    try:
        store_list = page.get_by_text("店舗リスト表示", exact=True)

        if store_list.count() > 0:
            store_list.first.click(timeout=5000)
            page.wait_for_timeout(3000)
            print("Switched to store list")
    except Exception as e:
        print("Store list switch warning:", e)

    # 少しずつスクロールして全件描画
    last_height = 0

    for i in range(30):
        try:
            height = page.evaluate("document.body.scrollHeight")

            page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )

            page.wait_for_timeout(700)

            if height == last_height:
                break

            last_height = height

        except Exception:
            break

    html = page.content()

    print("HTML LENGTH:", len(html))

    # HTML内のリンク候補をログ
    urls = extract_store_like_urls(html)

    print("URL CANDIDATES:", len(urls))

    for url in sorted(urls):
        print("URL:", url)

    return html


def parse_visible_cards(html):
    soup = BeautifulSoup(html, "html.parser")
    stores = []

    # 店舗カードらしきまとまりを広めに探す
    candidates = soup.find_all(
        ["article", "li", "section", "div"]
    )

    seen = set()

    for node in candidates:
        text = clean(node.get_text(" ", strip=True))

        if not text:
            continue

        # 北海道住所が入っているまとまりを優先
        if "北海道" not in text:
            continue

        # 長すぎる親要素は除外
        if len(text) > 1200:
            continue

        address_match = re.search(
            r"(北海道.{2,100}?)(?=TEL|電話|営業時間|定休日|メニュー|詳細|$)",
            text
        )

        address = clean(
            address_match.group(1)
            if address_match
            else ""
        )

        if not address:
            continue

        # 店名候補
        name = ""

        for tag in ["h1", "h2", "h3", "h4", "strong"]:
            title = node.find(tag)

            if title:
                name = clean(title.get_text(" ", strip=True))
                if name:
                    break

        if not name:
            # 住所より前の短いテキストを店名候補に
            before = text.split("北海道", 1)[0]
            before = clean(before)

            if 1 < len(before) < 100:
                name = before

        phone = ""

        tel = node.select_one('a[href^="tel:"]')

        if tel:
            phone = clean(
                tel.get("href", "").replace("tel:", "")
            )

        link = ""

        for a in node.find_all("a", href=True):
            href = absolute_url(a.get("href"))

            if "/teppan/" in href:
                link = href
                break

        image = ""

        img = node.find("img", src=True)

        if img:
            image = absolute_url(img.get("src"))

        key = (name, address)

        if key in seen:
            continue

        seen.add(key)

        stores.append({
            "name": name,
            "address": address,
            "phone": phone,
            "description": "",
            "image": image,
            "source_url": link or SEARCH_URL,
            "source": "U-WORD てっぱん"
        })

    return stores


def fallback_extract_by_text(page):
    print("STEP 3: fallback visible-text extraction")

    text = clean(page.locator("body").inner_text())

    # 北海道から始まる住所っぽい箇所を探す
    addresses = re.findall(
        r"北海道.{2,80}?(?=TEL|電話|営業時間|定休日|メニュー|詳細|ポイント|$)",
        text
    )

    unique_addresses = []

    for item in addresses:
        item = clean(item)

        if item and item not in unique_addresses:
            unique_addresses.append(item)

    print("Visible Hokkaido address candidates:", len(unique_addresses))

    for address in unique_addresses[:50]:
        print("ADDRESS CANDIDATE:", address)

    return unique_addresses


def main():
    stores = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context = browser.new_context(
            locale="ja-JP",
            viewport={
                "width": 390,
                "height": 844
            },
            user_agent=(
                "Mozilla/5.0 "
                "(iPhone; CPU iPhone OS 18_0 like Mac OS X) "
                "AppleWebKit/605.1.15 "
                "(KHTML, like Gecko) "
                "Version/18.0 Mobile/15E148 Safari/604.1"
            )
        )

        page = context.new_page()

        choose_hokkaido(page)

        html = collect_result_data(page)

        stores = parse_visible_cards(html)

        print("Parsed stores:", len(stores))

        if not stores:
            fallback_extract_by_text(page)

        browser.close()

    # 重複削除
    unique = {}

    for store in stores:
        key = (
            store.get("name", ""),
            store.get("address", "")
        )

        unique[key] = store

    stores = list(unique.values())

    print("Hokkaido stores found:", len(stores))

    # 0件なら既存データを壊さない
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

    print("Saved stores.json:", len(stores))


if __name__ == "__main__":
    main()
