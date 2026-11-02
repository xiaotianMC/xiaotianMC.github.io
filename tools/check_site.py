"""Check local static-site references without third-party dependencies."""

from html.parser import HTMLParser
from pathlib import Path
import json
import posixpath
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
ROOT_URL = re.compile(r"[\"'](/(?:assets|hidamari-channel|minecraft|works|feedback)/[^\s\"'<>`]+)[\"']")
CSS_URL = re.compile(r"url\(\s*([\"']?)(.*?)\1\s*\)", re.IGNORECASE)


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.script = False
        self.style = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name in ("href", "src", "poster"):
            if attrs.get(name):
                self.urls.append(attrs[name])
        if attrs.get("style"):
            self.urls.extend(match[1] for match in CSS_URL.findall(attrs["style"]))
        self.script = self.script or tag == "script"
        self.style = self.style or tag == "style"

    def handle_endtag(self, tag):
        if tag == "script":
            self.script = False
        if tag == "style":
            self.style = False

    def handle_data(self, data):
        if self.script:
            self.urls.extend(ROOT_URL.findall(data))
        if self.style:
            self.urls.extend(match[1] for match in CSS_URL.findall(data))


def json_urls(value):
    if isinstance(value, dict):
        for item in value.values():
            yield from json_urls(item)
    elif isinstance(value, list):
        for item in value:
            yield from json_urls(item)
    elif isinstance(value, str) and value.startswith("/"):
        yield value


def main():
    files = {
        path.relative_to(ROOT).as_posix(): path
        for directory in ("assets", "feedback", "hidamari-channel", "minecraft", "works")
        for path in (ROOT / directory).rglob("*")
        if path.is_file()
    }
    files["index.html"] = ROOT / "index.html"
    errors = []
    checked = 0
    for source, path in sorted(files.items()):
        if path.suffix not in (".html", ".css", ".js", ".json"):
            continue
        text = path.read_text(encoding="utf-8-sig")
        if path.suffix == ".html":
            parser = References()
            parser.feed(text)
            urls = parser.urls
        elif path.suffix == ".css":
            urls = [match[1] for match in CSS_URL.findall(text)]
        elif path.suffix == ".js":
            urls = ROOT_URL.findall(text)
        else:
            urls = list(json_urls(json.loads(text)))
        for url in urls:
            if url.startswith(("#", "//")):
                continue
            parsed = urlsplit(url)
            if parsed.scheme or not parsed.path:
                continue
            local = unquote(parsed.path)
            target = posixpath.normpath(
                local.lstrip("/") if local.startswith("/")
                else posixpath.join(posixpath.dirname(source), local)
            )
            if local.endswith("/") or target == ".":
                target = posixpath.join(target, "index.html")
            checked += 1
            if target not in files:
                errors.append(f"{source}: {url} -> {target}")
    for error in errors:
        print(f"Missing local reference: {error}", file=sys.stderr)
    print(f"Checked {checked} local references; {len(errors)} missing.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
