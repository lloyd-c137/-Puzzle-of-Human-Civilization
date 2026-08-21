#!/usr/bin/env python3
"""Serve the Liquid Type Test Interactive Lab locally.

The lab page is intentionally excluded from GitHub Pages. This small server
renders the existing Markdown page shell and serves its local CSS and JS
assets, so the SQLite-in-the-browser workflow can be used at the bench.
"""

from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
LAB_SOURCE = ROOT / "Chem Journal" / "Liquid Type Test Interactive Lab.md"


def render_lab_page() -> bytes:
    source = LAB_SOURCE.read_text(encoding="utf-8")
    parts = source.split("---", 2)
    body = parts[2] if len(parts) == 3 else source
    body = body.replace("{{ '/assets/js/liquid-test-lab.js' | relative_url }}", "/assets/js/liquid-test-lab.js")
    page = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Liquid Type Test Interactive Lab · Puzzle of Human Civilization</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/liquid-test-lab.css">
  <script>
    window.MathJax = {{
      tex: {{ inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']] }},
      svg: {{ fontCache: 'global' }}
    }};
  </script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="site-title" href="/">Puzzle of Human Civilization</a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/">Directory</a>
        <a href="/liquid-type-test-lab/">Liquid Lab</a>
      </nav>
    </div>
  </header>
  <main class="container content">
    <article>
      <p class="breadcrumb"><a href="/">Puzzle of Human Civilization</a> / Liquid Type Test Interactive Lab</p>
      {body}
    </article>
  </main>
  <footer class="site-footer">Puzzle of Human Civilization · Local chemistry lab</footer>
</body>
</html>
"""
    return page.encode("utf-8")


class LabRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):  # noqa: N802
        path = urlparse(self.path).path
        if path in {"/", "/liquid-type-test-lab", "/liquid-type-test-lab/"}:
            payload = render_lab_page()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()


class ReusableHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Liquid Type Test Interactive Lab locally.")
    parser.add_argument("--host", default="127.0.0.1", help="Interface to bind, default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=8765, help="Port to bind, default: 8765")
    args = parser.parse_args()
    server = ReusableHTTPServer((args.host, args.port), LabRequestHandler)
    print(f"Liquid Type Test Interactive Lab: http://{args.host}:{args.port}/liquid-type-test-lab/", flush=True)
    print("Press Ctrl-C to stop the local server.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping local lab server.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
