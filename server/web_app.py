"""Serve the built React client and the question bank API locally."""

import argparse
import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from quiz_game import load_questions

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "client" / "dist"

MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
    ".map": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
}


class QuizHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/api/questions":
            data = json.dumps([asdict(question) for question in load_questions()]).encode("utf-8")
            self._send(200, "application/json; charset=utf-8", data, no_store=True)
            return
        file_path = self._resolve_static(path)
        if file_path is None:
            self.send_error(404, "Not found")
            return
        self._send(200, MIME_TYPES.get(file_path.suffix, "application/octet-stream"), file_path.read_bytes())

    def _resolve_static(self, path):
        if path in ("/", "/index.html"):
            return DIST / "index.html"
        candidate = (DIST / path.lstrip("/")).resolve()
        if DIST.resolve() in candidate.parents and candidate.is_file():
            return candidate
        return None

    def _send(self, status, content_type, data, no_store=False):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        if no_store:
            self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def create_server(host="127.0.0.1", port=8000):
    return ThreadingHTTPServer((host, port), QuizHandler)


def main():
    parser = argparse.ArgumentParser(description="Run the quiz website locally.")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on (default: 8000)")
    args = parser.parse_args()
    if not (DIST / "index.html").is_file():
        print(
            "No built client found. Run `npm install && npm run build` inside client/ first.",
            flush=True,
        )
        raise SystemExit(1)
    with create_server(port=args.port) as server:
        print("Quiz website: http://127.0.0.1:{}/".format(server.server_port), flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    main()
