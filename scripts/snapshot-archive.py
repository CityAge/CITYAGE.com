"""Save a frozen copy of every old WordPress page listed in the archive's sitemaps.

Pages are written to public/__archive/<path>/index.html and served at their original
cityage.com addresses (see next.config.mjs). Run slowly: Hostinger throttles bursts.
"""
import os
import re
import sys
import time
import urllib.error
import urllib.request

ARCHIVE = 'https://archive.cityage.com'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', '__archive')
SITEMAPS = ['/page-sitemap.xml', '/post-sitemap.xml', '/category-sitemap.xml', '/local-sitemap.xml']
UA = 'Mozilla/5.0 (compatible; CityAge-archive-snapshot/1.0; +https://cityage.com)'
# Addresses the new site owns or forwards; never freeze these.
SKIP = {'/'}


def get(url, tries=6):
    wait = 5
    for _ in range(tries):
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504):
                time.sleep(wait)
                wait *= 2
                continue
            return e.code, b''
        except Exception:
            time.sleep(wait)
            wait *= 2
    return 0, b''


def main():
    paths = []
    for sm in SITEMAPS:
        status, body = get(ARCHIVE + sm)
        if status != 200:
            print(f'sitemap {sm}: {status}', file=sys.stderr)
            sys.exit(1)
        for loc in re.findall(rb'<loc>([^<]+)</loc>', body):
            p = re.sub(r'^https?://[^/]+', '', loc.decode().strip())
            if p not in paths and p not in SKIP:
                paths.append(p)
    print(f'{len(paths)} pages to freeze')
    failed = []
    for i, p in enumerate(paths, 1):
        status, body = get(ARCHIVE + p)
        if status != 200 or b'<html' not in body[:2000].lower():
            failed.append(f'{status} {p}')
            print(f'[{i}] FAIL {status} {p}')
        else:
            target = os.path.join(OUT, p.strip('/'), 'index.html')
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with open(target, 'wb') as f:
                f.write(body)
            print(f'[{i}] ok {p} {len(body)//1024}KB')
        time.sleep(2)
    with open(os.path.join(OUT, 'SNAPSHOT.txt'), 'w') as f:
        f.write(f'Frozen from {ARCHIVE} on {time.strftime("%Y-%m-%d")}: {len(paths) - len(failed)} of {len(paths)} pages.\n')
        f.writelines(x + '\n' for x in failed)
    print(f'done: {len(paths) - len(failed)} saved, {len(failed)} failed')
    if len(failed) > len(paths) // 10:
        sys.exit(1)


if __name__ == '__main__':
    main()
