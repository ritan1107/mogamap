import json
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://u-word.com"
START_URL = "https://u-word.com/teppan"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; MogaMapBot/1.0)"
}

def clean(text):
    return re.sub(r"\s+", " ", text or "").strip()

def get_soup(url):
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")

def extract_store_links(soup):
    links = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]

        if "/teppan/store/" in href or "/store/storeDetail/" in href:
            links.add(urljoin(BASE_URL, href))

    return sorted(links)

def extract_store(url):
    soup = get_soup(url)

    title = clean(
        soup.find("h1").get_text(" ", strip=True)
        if soup.find("h1")
        else soup.title.get_text(" ", strip=True)
        if soup.title
        else ""
    )

    text = clean(soup.get_text(" ", strip=True))

    address = ""
    phone = ""

    address_match = re.search(
        r"(北海道[^電話〒]{5,80})",
        text
    )
    if address_match:
        address = clean(address_match.group(1))

    phone_match = re.search(
        r"(0\d{1,4}-\d{1,4}-\d{3,4})",
        text
    )
    if phone_match:
        phone = phone_match.group(1)

    image = ""
    og_image = soup.find("meta", property="og:image")
    if og_image and og_image.get("content"):
        image = urljoin(BASE_URL, og_image["content"])

    description = ""
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        description = clean(og_desc["content"])

    return {
        "name": title,
        "address": address,
        "phone": phone,
        "description": description,
        "image": image,
        "source_url": url,
        "source": "u-word teppan"
    }

def main():
    print("Loading:", START_URL)

    soup = get_soup(START_URL)
    links = extract_store_links(soup)

    print("Found store links:", len(links))

    stores = []

    for url in links:
        try:
            store = extract_store(url)

            # 北海道だけを対象にする
            if "北海道" not in store["address"]:
                continue

            # 店名が空のデータは除外
            if not store["name"]:
                continue

            stores.append(store)
            print("OK:", store["name"])

        except Exception as e:
            print("ERROR:", url, e)

    # 重複除去
    unique = {}
    for store in stores:
        key = store["source_url"]
        unique[key] = store

    stores = list(unique.values())

    # 0件のとき既存データを壊さない
    if not stores:
        print("No stores found. stores.json was not overwritten.")
        return

    with open("stores.json", "w", encoding="utf-8") as f:
        json.dump(
            stores,
            f,
            ensure_ascii=False,
            indent=2
        )

    print("Saved stores.json:", len(stores))

if __name__ == "__main__":
    main()
