"""Check generated navigation, article metadata, feed, sitemap and local links."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import sys
import xml.etree.ElementTree as ET

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
base = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else ''
errors = []

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.links = []
        self.title = False
        self.description = False
        self.main = False
        self.feed(text)
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'title': self.title = True
        if tag == 'main': self.main = True
        if tag == 'meta' and attrs.get('name') == 'description': self.description = bool(attrs.get('content'))
        if tag == 'a' and attrs.get('href'): self.links.append(attrs['href'])
        if tag in ('script', 'img') and attrs.get('src'): self.links.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon'): self.links.append(attrs.get('href', ''))

pages = {p: Page(p.read_text()) for p in root.rglob('*.html')}
for path, page in pages.items():
    relative = path.relative_to(root).as_posix()
    if not (page.title and page.description and page.main): errors.append(f'{relative}: missing title, description or main')
    current_url = base + '/' + relative
    for href in page.links:
        url = urlsplit(href)
        if url.scheme or url.netloc: continue
        resolved = urlsplit(urljoin(current_url, href))
        url_path = unquote(resolved.path)
        if base:
            if not url_path.startswith(base + '/'): errors.append(f'{relative}: link escapes baseurl: {href}'); continue
            url_path = url_path[len(base):]
        target = root / url_path.lstrip('/')
        if target.is_dir(): target /= 'index.html'
        if not target.exists(): errors.append(f'{relative}: broken local link: {href}'); continue
        fragment = unquote(resolved.fragment)
        if fragment and target in pages and fragment not in pages[target].ids:
            errors.append(f'{relative}: missing anchor: {href}')
for name in ('feed.xml','sitemap.xml'):
    try: ET.parse(root / name)
    except (ET.ParseError, FileNotFoundError) as exc: errors.append(f'{name}: {exc}')
archive = (root / 'archive/index.html').read_text()
expected = sum('published: false' not in p.read_text().split('\n---\n',1)[0] for p in Path('_posts').iterdir())
actual = archive.count('class="archive-row"')
if actual != expected: errors.append(f'archive: expected {expected} posts, found {actual}')
for name in ('index.html','about/index.html','archive/index.html','topics/index.html','404.html'):
    if not (root / name).exists(): errors.append(f'missing page: {name}')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'OK: {len(pages)} HTML pages, {actual} published posts, local links and anchors, feed and sitemap.')
