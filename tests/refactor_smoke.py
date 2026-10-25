import json
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
sys.stdout.reconfigure(encoding="utf-8")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format, *_args):
        pass


class QuietServer(ThreadingHTTPServer):
    def handle_error(self, _request, _client_address):
        pass


CASES = [
    ("/", None, False),
    ("/pages/login.html", None, False),
    ("/pages/404.html", None, False),
    ("/pages/diner-menu.html", None, True),
    ("/pages/diner-dish-detail.html?id=m01", None, True),
    ("/pages/diner-table-order.html", None, True),
    ("/pages/diner-order-status.html", None, True),
    ("/pages/kitchen-board.html", "kitchen", False),
    ("/pages/kitchen-order-detail.html?id=missing", "kitchen", False),
    ("/pages/kitchen-wait-time-alerts.html", "kitchen", False),
    ("/pages/manager-menu-management.html", "manager", False),
    ("/pages/manager-payment-requests.html", "manager", False),
    ("/pages/manager-feedback-center.html", "manager", False),
    ("/pages/manager-sales-insights.html", "admin", False),
    ("/pages/admin-table-management.html", "manager", False),
    ("/pages/admin-user-management.html", "admin", False),
    ("/pages/admin-settings.html", "admin", False),
]


def mock_supabase(route):
    url = route.request.url
    if "validate_qr_session" in url:
        route.fulfill(status=200, content_type="application/json", body="true")
    else:
        route.fulfill(status=200, content_type="application/json", body="[]")


def run():
    failures = []
    handler = partial(QuietHandler, directory=str(ROOT))
    server = QuietServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base_url = f"http://127.0.0.1:{server.server_port}"

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            for url, role, qr_required in CASES:
                print(f"TEST {url}", flush=True)
                context = browser.new_context()
                context.route("**://*.supabase.co/**", mock_supabase)
                context.route(
                    "https://cdn.jsdelivr.net/**",
                    lambda route: route.fulfill(
                        status=200,
                        content_type="application/javascript",
                        body="window.QRCode=function(){}; window.QRCode.CorrectLevel={H:1};",
                    ),
                )
                payload = json.dumps({"role": role, "qrRequired": qr_required})
                context.add_init_script(
                    script="""
                    (() => {
                      const { role, qrRequired } = __PAYLOAD__;
                      if (role) {
                        sessionStorage.setItem('menumind:session', JSON.stringify({
                          accessToken: 'smoke-token',
                          staff: { id: 'smoke', name: 'Smoke Test', email: 'smoke@menumind.vn', role, status: 'active' }
                        }));
                      }
                      if (qrRequired) {
                        sessionStorage.setItem('menumind:qr-session', JSON.stringify({ table: 'A01', token: 'smoke-token' }));
                        sessionStorage.setItem('menumind:table', 'A01');
                      }
                    })();
                    """.replace("__PAYLOAD__", payload)
                )
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on(
                    "console",
                    lambda message: errors.append(message.text)
                    if message.type == "error" and "Failed to load resource" not in message.text
                    else None,
                )
                try:
                    page.goto(base_url + url, wait_until="domcontentloaded", timeout=5000)
                    page.wait_for_timeout(500)
                    heading = page.locator("main h1").first.text_content() or ""
                    if "Đang tải" in heading:
                        errors.append(f"Trang chưa render: {heading}")
                    if page.locator('link[href*="common.css"]').count() != 1:
                        errors.append("Trang thiếu common.css")
                    if page.locator('link[href*="header.css"]').count() != 1:
                        errors.append("Trang thiếu header.css")
                    if page.locator('script[src*="common.js"]').count() != 1:
                        errors.append("Trang thiếu common.js")
                    if page.locator('script[src*="header.js"]').count() != 1:
                        errors.append("Trang thiếu header.js")
                except Exception as error:
                    errors.append(str(error))
                if errors:
                    failures.append((url, errors))
                context.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    if failures:
        for url, errors in failures:
            print(f"FAIL {url}")
            for error in errors:
                print(f"  - {error}")
        raise SystemExit(1)
    print(f"PASS: {len(CASES)} trang tải đúng CSS/JavaScript riêng và không có lỗi runtime.")


if __name__ == "__main__":
    run()
