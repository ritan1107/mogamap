import json
import re
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

START_URL = "https://u-word.com/teppan"
BASE_URL = "https://u-word.com"


def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()


def looks_like_store_url(url):
    url_lower = url.lower()

    if "u-word.com" not in url_lower:
        return False

    # 店舗詳細ページとして可能性が高いURL
    keywords = [
        "member-store",
        "/store/",
        "storedetail",
        "/shop/",
        "shopdetail",
        "/detail/",
    ]

    if any(word in url_lower for word in keywords):
        return True

    return False


def extract_detail(page, url):
    print("Opening:", url)

    page.goto(
        url,
        wait_until="domcontentloaded",
        timeout=60000
    )

    page.wait_for_timeout(2500)

    html = page.content()
    soup = BeautifulSoup(html, "html.parser")

    text = clean(soup.get_text(" ", strip=True))

    # 北海道以外は除外
    if "北海道" not in text:
        return None

    name = ""

    h1 = soup.find("h1")
    if h1:
        name = clean(h1.get_text(" ", strip=True))

    if not name:
        og_title = soup.find("meta", property="og:title")
        if og_title:
            name = clean(og_title.get("content"))

    if not name and soup.title:
        name = clean(soup.title.get_text(" ", strip=True))

    if not name:
        return None

    address = ""

    patterns = [
        r"(〒?\d{3}-?\d{4}\s*北海道.{3,100}?)(?:TEL|電話|営業時間|定休日|アクセス|$)",
        r"(北海道.{3,100}?)(?:TEL|電話|営業時間|定休日|アクセス|$)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            address = clean(match.group(1))
            break

    phone = ""

    phone_match = re.search(
        r"0\d{1,4}[-ー‐]\d{1,4}[-ー‐]\d{3,4}",
        text
    )

    if phone_match:
        phone = (
            phone_match.group(0)
            .replace("ー", "-")
            .replace("‐", "-")
        )

    image = ""

    og_image = soup.find("meta", property="og:image")

    if og_image and og_image.get("content"):
        image = urljoin(BASE_URL, og_image["content"])

    description = ""

    og_description = soup.find(
        "meta",
        property="og:description"
    )

    if og_description and og_description.get("content"):
        description = clean(
            og_description["content"]
        )

    return {
        "name": name,
        "address": address,
        "phone": phone,
        "description": description,
        "image": image,
        "source_url": url,
        "source": "U-WORD てっぱん"
    }


def main():
    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        context = browser.new_context(
            viewport={
                "width": 1280,
                "height": 1800
            },
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

        # JavaScript表示待ち
        page.wait_for_timeout(5000)

        # 下までスクロールして遅延読み込みを表示
        for i in range(12):
            page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )
            page.wait_for_timeout(1000)

        html = page.content()

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        all_links = set()

        for a in soup.find_all(
            "a",
            href=True
        ):
            href = clean(a.get("href"))

            if not href:
                continue

            absolute = urljoin(
                START_URL,
                href
            )

            parsed = urlparse(absolute)

            if parsed.netloc.endswith(
                "u-word.com"
            ):
                all_links.add(absolute)

        print(
            "All internal links:",
            len(all_links)
        )

        # デバッグ用に実際のリンクをログへ表示
        for url in sorted(all_links)[:100]:
            print("LINK:", url)

        store_links = sorted(
            url
            for url in all_links
            if looks_like_store_url(url)
        )

        print(
            "Found candidate store links:",
            len(store_links)
        )

        stores = []

        detail_page = context.new_page()

        for url in store_links:

            try:
                store = extract_detail(
                    detail_page,
                    url
                )

                if store:
                    stores.append(store)

                    print(
                        "STORE:",
                        store["name"]
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
        unique[
            store["source_url"]
        ] = store

    stores = list(
        unique.values()
    )

    print(
        "Hokkaido stores found:",
        len(stores)
    )

    # 0件の場合は現在のJSONを壊さない
    if len(stores) == 0:
        print(
            "No stores found. "
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
