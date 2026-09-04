from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "market-dashboard.html"
text = PAGE.read_text(encoding="utf-8")
soup = BeautifulSoup(text, "html.parser")
errors: list[str] = []

if soup.html is None or not soup.html.get("lang"):
    errors.append("html lang attribute is required")
if soup.find("meta", attrs={"name": "viewport"}) is None:
    errors.append("viewport meta tag is required")
if soup.title is None or not soup.title.get_text(strip=True):
    errors.append("document title is required")

ids = [node.get("id") for node in soup.find_all(attrs={"id": True})]
if len(ids) != len(set(ids)):
    errors.append("duplicate ids detected")

for image in soup.find_all("img"):
    if image.get("alt") is None:
        errors.append("image missing alt text")

for link in soup.find_all(["a", "script", "link"], href=True):
    href = link.get("href", "")
    parsed = urlparse(href)
    if not parsed.scheme and parsed.path and not href.startswith(("#", "mailto:", "tel:")):
        target = ROOT / parsed.path
        if not target.exists():
            errors.append(f"missing local reference: {href}")

for forbidden in [
    r"sk-[A-Za-z0-9_-]{20,}",
    r"ANTHROPIC_API_KEY\s*=",
    r"OPENAI_API_KEY\s*=",
    r"-----BEGIN (?:RSA |EC )?PRIVATE KEY-----",
]:
    if re.search(forbidden, text):
        errors.append(f"secret-like pattern found: {forbidden}")

if re.search(r"\bTODO\b|lorem ipsum", text, re.IGNORECASE):
    errors.append("placeholder text found")
if "not financial advice" not in text.lower():
    errors.append("financial-information disclaimer is required")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("PASS: dashboard structure, IDs, references, secret denylist, placeholders, and disclaimer")
