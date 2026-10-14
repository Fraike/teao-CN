"""Read-only public-site inventory. Preserves path spelling, spaces and queries."""
import concurrent.futures
import hashlib
import json
import re
import subprocess
import time
from collections import defaultdict
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
from xml.etree import ElementTree

ORIGIN = "https://www.chinateao.com"
OUTPUT = Path("docs/site-audit/2026-09-09")
CACHE = Path("/tmp/teao-cn-live-audit")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.base = ORIGIN + "/"
        self.links = []
        self.images = []
        self.title = ""
        self.description = ""
        self.canonical = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "base":
            self.base = attrs.get("href", self.base)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "img":
            self.images.append(attrs.get("data-original") or attrs.get("src", ""))
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def normalize(href, base=ORIGIN + "/"):
    if href.startswith(("#", "javascript:", "mailto:", "tel:")):
        return None
    value = urlsplit(urljoin(base, href))
    if value.scheme not in ("http", "https") or value.hostname != "www.chinateao.com":
        return None
    path = quote(unquote(value.path or "/"), safe="/!$&'()*+,;=:@-._~")
    # Fetch HTML only; downloadable media are inventoried separately.
    if re.search(r"\.(?:png|jpe?g|webp|gif|svg|pdf|zip|rar|mp4|webm|js|css|ico|xml|txt|docx?|xlsx?)$", path, re.I):
        return None
    return urlunsplit(("https", "www.chinateao.com", path, value.query, ""))


def fetch(url):
    key = hashlib.sha256(url.encode()).hexdigest()
    file = CACHE / (key + ".html")
    result = subprocess.run(
        ["curl", "--globoff", "-L", "--max-redirs", "5", "--max-time", "20", "--retry", "1",
         "-sS", "-A", "TEAO-site-migration-audit/1.0", "-o", str(file),
         "-w", "%{http_code}\n%{url_effective}\n%{content_type}", url],
        capture_output=True, text=True,
    )
    parts = result.stdout.splitlines()
    status = int(parts[0]) if parts and parts[0].isdigit() else 0
    final_url = parts[1] if len(parts) > 1 else url
    content_type = parts[2] if len(parts) > 2 else ""
    parser = Page()
    if file.exists() and "html" in content_type:
        parser.base = final_url
        parser.feed(file.read_text(errors="replace"))
    return {
        "url": url, "path": unquote(urlsplit(url).path), "status": status,
        "finalUrl": final_url, "title": parser.title.strip(),
        "description": parser.description.strip(), "canonical": parser.canonical,
        "contentType": content_type, "error": result.stderr.strip(),
        "links": sorted({u for h in parser.links if (u := normalize(h, parser.base))}),
        "images": sorted({urljoin(parser.base, h) for h in parser.images if h}),
        "snapshot": str(file),
    }


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    xml = subprocess.check_output(["curl", "-sS", "--max-time", "30", ORIGIN + "/sitemap.xml"])
    (OUTPUT / "source-sitemap.xml").write_bytes(xml)
    root = ElementTree.fromstring(xml)
    sitemap = {normalize(e.text) for e in root.iter() if e.tag.endswith("loc")}
    sitemap.discard(None)
    sources = defaultdict(set)
    for url in sitemap:
        sources[url].add("sitemap.xml")
    sources[ORIGIN + "/"].add("entrypoint")
    pending = set(sources)
    records = {}
    limit = 500
    # Conservative defaults; stop when the site refuses automated requests.
    consecutive_denials = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        while pending and len(records) < limit:
            batch = sorted(pending)[:1]
            pending.difference_update(batch)
            for item in executor.map(fetch, batch):
                records[item["url"]] = item
                consecutive_denials = consecutive_denials + 1 if item["status"] in (403, 429) else 0
                if item["status"] == 200:
                    for link in item["links"]:
                        sources[link].add(item["url"])
                        if link not in records and link not in batch:
                            pending.add(link)
            print(f"fetched={len(records)} remaining={len(pending)}", flush=True)
            if consecutive_denials >= 3:
                break
            time.sleep(0.5)
    for url, item in records.items():
        item["inSitemap"] = url in sitemap
        item["discoveredFrom"] = sorted(sources[url])
    report = {
        "origin": ORIGIN, "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "scope": "Public sitemap plus recursive same-host HTML anchors; no forms submitted. Does not include orphan URLs, server logs or authenticated content.",
        "sitemapCount": len(sitemap), "fetchedCount": len(records),
        "unvisited": sorted(pending), "pages": [records[u] for u in sorted(records)],
    }
    (OUTPUT / "inventory.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
