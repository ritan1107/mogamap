import json
import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


BASE_URL = "https://u-word.com"
TOP_URL = "https://u-word.com/teppan"
SEARCH_URL = "https://u-word.com/teppan/store/searchResult"
OUTPUT_FILE = "stores.json"


def clean(value):
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def find_store_urls(text):
    found = set()

    if not text:
        return found

    patterns = [
        r'https?://u-word\.com/teppan/store/storeDetail/\d+',
        r'/teppan/store/storeDetail/\d+',
        r'teppan/store/storeDetail/\d+',
    ]

    for pattern in patterns:
        for item in re.findall(pattern, text):
            found.add(urljoin(BASE_URL, item))

    return found


def collect_urls(page):
    urls = set()

    def watch_response(response):
        try:
            urls.update(find_store_urls(response.url))

            content_type = response.headers.get("content-type", "")

            if (
                "json" in content_type
                or "html" in content_type
                or "text" in content_type
                or "javascript" in content_type
            ):
                try:
                    body = response.text()
                    urls.update(find_store_urls(body))
                except Exception:
                    pass

        except Exception:
            pass

    page.on("response", watch_response)

    print("STEP 1: Loading top page")
    print("Loading:", TOP_URL)

    page.goto(
        TOP_URL,
        wait_until="domcontentloaded",
        timeout=60000
    )

    page.wait_for_timeout(3000)

    print("STEP 2: Opening search result")
    print("Loading:", SEARCH_URL)

    page.goto(
        SEARCH_URL,
        wait_until="domcontentloaded",
        timeout=60000
    )

    page.wait_for_timeout(5000)

    print("Current URL:", page.url)
    print("Page title:", page.title())

    # ページ全体HTML
    html = page.content()
    urls.update(find_store_urls(html))

    print("Initial URLs:", len(urls))

    # aタグ全部
    try:
        hrefs = page.locator("a").evaluate_all(
            """els => els.map(e => ({
                href: e.href || e.getAttribute('href') || '',
                onclick: e.getAttribute('onclick') || '',
                text: e.innerText || ''
            }))"""
        )

        print("A tags:", len(hrefs))

        for item in hrefs:
            urls.update(find_store_urls(item.get("href", "")))
            urls.update(find_store_urls(item.get("onclick", "")))
            urls.update(find_store_urls(item.get("text", "")))

    except Exception as e:
        print("A tag scan warning:", e)

    # scriptタグ
    try:
        scripts = page.locator("script").all_text_contents()
        print("Scripts:", len(scripts))

        for script in scripts:
            urls.update(find_store_urls(script))

    except Exception as e:
        print("Script scan warning:", e)

    # data-* 属性やonclickなどを全部見る
    try:
        attrs = page.locator("*").evaluate_all(
            """els => els.map(e => {
                let out = '';
                for (const a of e.attributes) {
                    out += ' ' + a.name + '=' + a.value;
                }
                return out;
            })"""
        )

        for attr in attrs:
            urls.update(find_store_urls(attr))

    except Exception as e:
        print("Attribute scan warning:", e)

    # スクロールして遅延ロード
    last_height = 0

    for i in range(20):
        try:
            height = page.evaluate("document.body.scrollHeight")

            page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )

            page.wait_for_timeout(1000)

            html = page.content()
            urls.update(find_store_urls(html))

            print(
                "Scroll",
                i + 1,
                "height:",
                height,
                "URLs:",
                len(urls)
            )

            if height == last_height:
                break

            last_height = height

        except Exception as e:
            print("Scroll warning:", e)
            break

    # ボタン類も確認
    try:
        buttons = page.locator("button").all_text_contents()
        print("Buttons:", buttons[:30])
    except Exception:
        pass

    print("Candidate URLs:", len(urls))

    for url in sorted(urls):
        print("CANDIDATE:", url)

    return sorted(urls)


def extract_name(soup):
    for selector in [
        "h1",
        "h2",
        ".store-name",
        ".shop-name",
        ".title",
    ]:
        node = soup.select_one(selector)

        if node:
            name = clean(node.get_text(" ", strip=True))

            if name:
                return name

    if soup.title:
        return clean(soup.title.get_text())

    return ""


def extract_address(soup):
    text = clean(soup.get_text(" ", strip=True))

    match = re.search(
        r'(北海道.{2,120}?)(?=TEL|電話|営業時間|定休日|アクセス|MAP|地図|$)',
        text,
        re.IGNORECASE
    )

    if match:
        return clean(match.group(1))

    match = re.search(
        r'(北海道[^|｜]{2,120})',
        text
    )

    if match:
        return clean(match.group(1))

    return ""


def extract_phone(soup):
    tel = soup.select_one('a[href^="tel:"]')

    if tel:
        return clean(
            tel.get("href", "").replace("tel:", "")
        )

    text = clean(soup.get_text(" ", strip=True))

    match = re.search(
        r'(?:TEL|電話)[：:\s]*'
        r'(0\d{1,4}[-ー−]?\d{1,4}[-ー−]?\d{3,4})',
        text,
        re.IGNORECASE
    )

    if match:
        return clean(match.group(1))

    return ""


def extract_image(soup, current_url):
    for selector in [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
    ]:
        node = soup.select_one(selector)

        if node and node.get("content"):
            return urljoin(
                current_url,
                node.get("content")
            )

    img = soup.select_one("img[src]")

    if img:
        return urljoin(
            current_url,
            img.get("src")
        )

    return ""


def read_store(page, url):
    try:
        print("Opening:", url)

        page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=60000
        )

        page.wait_for_timeout(1200)

        soup = BeautifulSoup(
            page.content(),
            "html.parser"
        )

        name = extract_name(soup)
        address = extract_address(soup)

        print("STORE:", name)
        print("ADDRESS:", address)

        if "北海道" not in address:
            print("SKIP: Not Hokkaido")
            return None

        return {
            "name": name,
            "address": address,
            "phone": extract_phone(soup),
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
                "width": 1280,
                "height": 1400
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

        urls = collect_urls(page)

        for url in urls:
            store = read_store(page, url)

            if store:
                stores.append(store)

        browser.close()

    # 重複削除
    unique = {}

    for store in stores:
        unique[store["source_url"]] = store

    stores = list(unique.values())

    print("Hokkaido stores found:", len(stores))

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
