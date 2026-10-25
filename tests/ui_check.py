import json
import os
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

PAGES = [
    "/index.html", "/pages/login.html", "/pages/diner-menu.html",
    "/pages/diner-dish-detail.html?id=m01", "/pages/diner-table-order.html",
    "/pages/diner-order-status.html", "/pages/kitchen-board.html",
    "/pages/kitchen-order-detail.html?id=MM-2409", "/pages/kitchen-wait-time-alerts.html",
    "/pages/manager-menu-management.html", "/pages/manager-sales-insights.html",
    "/pages/manager-feedback-center.html", "/pages/admin-table-management.html",
    "/pages/admin-user-management.html", "/pages/admin-settings.html", "/pages/404.html"
]


def setup_context(browser, viewport=None, role="admin"):
    context = browser.new_context(viewport=viewport) if viewport else browser.new_context()
    context.route(
        "**://*.supabase.co/**",
        lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body="true" if "validate" in route.request.url else "[]"
        )
    )
    context.route(
        "https://cdn.jsdelivr.net/**",
        lambda route: route.fulfill(
            status=200,
            content_type="application/javascript",
            body="window.QRCode=function(){}; window.QRCode.CorrectLevel={H:1};",
        ),
    )
    context.add_init_script(f"""
    (() => {{
      sessionStorage.setItem('menumind:session', JSON.stringify({{
        accessToken: 'test-token',
        staff: {{ id: 'u01', name: 'Nguyễn Văn An', email: 'staff@menumind.vn', role: '{role}', status: 'active' }}
      }}));
      sessionStorage.setItem('menumind:qr-session', JSON.stringify({{ table: 'A01', token: 'test-token' }}));
      sessionStorage.setItem('menumind:table', 'A01');
    }})();
    """)
    return context


PAGE_ROLES = {
    "/pages/kitchen-board.html": "kitchen",
    "/pages/kitchen-order-detail.html?id=MM-2409": "kitchen",
    "/pages/kitchen-wait-time-alerts.html": "kitchen",
    "/pages/manager-menu-management.html": "manager",
    "/pages/manager-payment-requests.html": "manager",
    "/pages/manager-feedback-center.html": "manager",
    "/pages/admin-table-management.html": "manager",
    "/pages/admin-user-management.html": "admin",
    "/pages/admin-settings.html": "admin",
    "/pages/manager-sales-insights.html": "admin",
}


def check_pages(base_url, browser, viewport, label):
    errors = []
    for path in PAGES:
        role = PAGE_ROLES.get(path, "admin")
        context = setup_context(browser, viewport, role=role)
        page = context.new_page()
        page.on("console", lambda msg: errors.append(f"console:{msg.text}") if msg.type == "error" and "Failed to load resource" not in msg.text else None)
        page.on("pageerror", lambda exc: errors.append(f"page:{exc}"))
        page.goto(base_url + path, wait_until="networkidle")
        assert page.locator("main h1").count() == 1, f"{path}: expected one h1"
        overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        assert not overflow, f"{path}: horizontal overflow at {viewport['width']}px"
        assert "Đang tải" not in page.locator("main").inner_text(), f"{path}: loading shell remained"
        if viewport["width"] > 900 and page.locator(".page-frame aside").count() > 0:
            aside_box = page.locator(".page-frame aside").first.bounding_box()
            main_box = page.locator("main").first.bounding_box()
            assert aside_box and main_box, f"{path}: missing boxes"
            assert main_box["x"] >= aside_box["x"] + aside_box["width"] - 10, f"{path}: main must be to the right of aside"
            assert main_box["y"] < 250, f"{path}: main pushed below aside: y={main_box['y']}"
        context.close()
    assert not errors, f"{label} browser errors: {errors}"


def check_flows(base_url, browser):
    context = setup_context(browser, {"width": 1440, "height": 1000}, role="admin")
    page = context.new_page()
    page.goto(base_url + "/index.html", wait_until="networkidle")
    assert page.locator("#qr-order").count() == 1
    assert page.locator(".metric-strip > div").count() == 4

    page.goto(base_url + "/pages/diner-menu.html", wait_until="networkidle")
    page.locator("#taste-form select[name='taste']").select_option(label="Thanh nhẹ")
    page.locator("#taste-form button[type='submit']").click()
    page.locator(".ai-answer").wait_for(timeout=3000)
    page.locator("[data-ai-accept]").click()
    assert page.locator("#cart-count").inner_text() == "1"

    page.locator("#menu-search").fill("không-có-món-này")
    assert page.locator(".empty-state").count() == 1
    page.locator("[data-action='clear-filter']").click()

    k_context = setup_context(browser, {"width": 1440, "height": 1000}, role="kitchen")
    k_page = k_context.new_page()
    k_page.goto(base_url + "/pages/kitchen-board.html", wait_until="networkidle")
    assert k_page.locator(".board").count() == 1
    k_context.close()

    m_context = setup_context(browser, {"width": 1440, "height": 1000}, role="manager")
    m_page = m_context.new_page()
    m_page.goto(base_url + "/pages/manager-menu-management.html", wait_until="networkidle")
    m_page.locator("[data-open='dish-dialog']").click()
    assert m_page.locator("#dish-dialog").is_visible()
    m_page.keyboard.press("Escape")
    assert not m_page.locator("#dish-dialog").is_visible()

    m_page.goto(base_url + "/pages/manager-feedback-center.html", wait_until="networkidle")
    m_page.locator("#theme-form input[name='goal']").fill("ngắn")
    m_page.locator("#theme-form button[type='submit']").click()
    assert m_page.locator(".ai-warning").count() == 1
    m_page.locator("#theme-form input[name='goal']").fill("Tìm vấn đề phục vụ cần ưu tiên trong tuần")
    m_page.locator("#theme-form button[type='submit']").click()
    m_page.locator(".ai-answer").wait_for(timeout=3000)

    output = Path("tmp/screenshots")
    output.mkdir(parents=True, exist_ok=True)
    m_page.screenshot(path=str(output / "feedback-desktop.png"), full_page=True)
    page.goto(base_url + "/index.html", wait_until="networkidle")
    page.screenshot(path=str(output / "home-desktop.png"), full_page=True)
    m_context.close()
    context.close()


def main():
    explicit_base = os.environ.get("MENUMIND_TEST_URL")
    server = None
    if explicit_base:
        base_url = explicit_base
    else:
        handler = partial(QuietHandler, directory=str(ROOT))
        server = QuietServer(("127.0.0.1", 0), handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base_url = f"http://127.0.0.1:{server.server_port}"

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            check_pages(base_url, browser, {"width": 1440, "height": 1000}, "desktop")
            check_pages(base_url, browser, {"width": 375, "height": 812}, "mobile")
            check_flows(base_url, browser)
            browser.close()
    finally:
        if server:
            server.shutdown()
            server.server_close()

    print("PASS: 16 pages, desktop/mobile layout, core flows and AI states")


if __name__ == "__main__":
    main()
