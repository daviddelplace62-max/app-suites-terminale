"""Vérifications fonctionnelles du parcours, sans modifier sa sauvegarde.

Exécution : python3 tests/smoke.py
Prérequis : Python Playwright et Chromium (SUITES_CHROMIUM permet son override).
Le serveur utilise un port local éphémère et tous les processus sont fermés.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import threading
from urllib.parse import urlsplit

from playwright.sync_api import Error as PlaywrightError, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
STORAGE_KEY = "suites-pas-a-pas.v1"
BROWSER = os.environ.get("SUITES_CHROMIUM", "/usr/bin/chromium")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def saved_profile(page, name):
    """Lecture seule : la progression est produite exclusivement par l'interface."""
    profiles = page.evaluate("key => JSON.parse(localStorage.getItem(key)).profiles", STORAGE_KEY)
    return next(person for person in profiles if person["name"] == name)


def assert_progress(page, name, count, history_count=None):
    progress = saved_profile(page, name)["progress"]
    assert len(progress["completed"]) == count, (name, progress)
    if history_count is not None:
        assert len(progress["history"]) == history_count, progress["history"]
    return progress


def create_profile(page, name):
    page.get_by_test_id("profile-name").fill(name)
    page.get_by_test_id("create-profile").click()
    assert name in page.locator("h1").inner_text()


def choose_profile(page, name):
    page.get_by_test_id("profile-card").filter(has=page.locator(".profile-card-name", has_text=name)).click()
    assert name in page.locator("h1").inner_text()


def submit_answer(page, exercise, correct=True):
    if exercise["type"] == "choice":
        answer = exercise["answer"] if correct else (exercise["answer"] + 1) % len(exercise["options"])
        page.get_by_test_id(f"choice-{answer}").check(force=True)
    else:
        answer = exercise["answer"] if correct else exercise["answer"] + max(1, abs(exercise["answer"]))
        # Virgule décimale acceptée : on vérifie aussi ce cas utile en français.
        page.get_by_test_id("answer-number").fill(str(answer).replace(".", ","))
    page.get_by_test_id("check-answer").click()


def assert_no_overflow(page, widths=(390, 360)):
    for width in widths:
        page.set_viewport_size({"width": width, "height": 844})
        page.evaluate("() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
        dimensions = page.evaluate("({page: document.documentElement.scrollWidth, viewport: innerWidth})")
        assert dimensions["page"] <= dimensions["viewport"] + 1, dimensions
    page.set_viewport_size({"width": 1440, "height": 1000})



def assert_mobile_menu(page, preserve_answer=False):
    page.set_viewport_size({"width": 390, "height": 844})
    page.evaluate("() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    if preserve_answer:
        page.get_by_test_id("answer-number").fill("10")
    toggle = page.locator(".mobile-menu-toggle")
    close = page.locator(".mobile-sidebar-close")
    toggle.click()
    assert close.is_visible()
    assert page.locator(".workspace").evaluate("element => element.inert")
    assert page.locator(".sidebar").evaluate("element => element.contains(document.activeElement)")
    # La fermeture reçoit le focus ; Maj+Tab reste dans le dialogue, puis Tab reboucle.
    assert close.evaluate("element => element === document.activeElement")
    page.keyboard.press("Shift+Tab")
    assert page.locator(".sidebar").evaluate("element => element.contains(document.activeElement)")
    page.keyboard.press("Tab")
    assert close.evaluate("element => element === document.activeElement")
    close.click()
    assert not page.locator(".workspace").evaluate("element => element.inert")
    if preserve_answer:
        assert page.get_by_test_id("answer-number").input_value() == "10"
    toggle.click()
    page.keyboard.press("Escape")
    assert not page.locator(".workspace").evaluate("element => element.inert")
    assert toggle.evaluate("element => element === document.activeElement")
    if preserve_answer:
        assert page.get_by_test_id("answer-number").input_value() == "10"
    toggle.click()
    assert page.locator(".menu-backdrop").is_visible()
    page.mouse.click(350, 160)
    assert not page.locator(".workspace").evaluate("element => element.inert")
    assert toggle.evaluate("element => element === document.activeElement")
    if preserve_answer:
        assert page.get_by_test_id("answer-number").input_value() == "10"
    page.set_viewport_size({"width": 1440, "height": 1000})
    page.evaluate("() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")


def run_http_flow(browser, base_url):
    context = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
    page = context.new_page()
    errors = []
    requests = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("request", lambda request: requests.append(request.url))
    try:
        page.goto(base_url, wait_until="networkidle")
        assert page.get_by_test_id("profile-name").is_visible()
        assert_no_overflow(page)
        lessons = page.evaluate("window.SUITES_COURSE.modules.flatMap(module => module.lessons)")
        assert len(lessons) == 25
        assert page.evaluate("window.SUITES_COURSE.modules.length") == 5

        create_profile(page, "Ma fille")
        assert_progress(page, "Ma fille", 0, 0)
        assert page.get_by_test_id("module-card").count() == 5
        for index in range(1, 5):
            assert page.get_by_test_id("module-card").nth(index).is_disabled()
        assert_no_overflow(page)
        page.screenshot(path="/tmp/suites-dashboard.png", full_page=True)
        print("PASS : création du profil, tableau de bord et verrouillage des modules")

        page.get_by_test_id("start-course").click()
        assert lessons[0]["title"] == page.locator(".lesson-title").inner_text()
        assert page.get_by_test_id("next-lesson").is_disabled()
        assert page.get_by_test_id("previous-lesson").is_enabled()
        assert page.get_by_role("button", name="Retour en arrière", exact=True).is_enabled()
        submit_answer(page, lessons[0]["exercise"], correct=False)
        assert "Indice" in page.get_by_test_id("feedback").inner_text()
        assert page.get_by_test_id("next-lesson").is_disabled()
        assert_progress(page, "Ma fille", 0, 1)
        submit_answer(page, lessons[0]["exercise"])
        assert page.get_by_test_id("next-lesson").is_enabled()
        assert "Bien joué" in page.get_by_test_id("feedback").inner_text()
        assert_progress(page, "Ma fille", 1, 2)
        page.get_by_test_id("next-lesson").click()
        assert lessons[1]["title"] == page.locator(".lesson-title").inner_text()
        page.get_by_test_id("previous-lesson").click()
        assert lessons[0]["title"] == page.locator(".lesson-title").inner_text()
        page.get_by_test_id("next-lesson").click()
        assert lessons[1]["title"] == page.locator(".lesson-title").inner_text()
        print("PASS : erreur bloquante, indice, correction, étape suivante et retour")
        assert_mobile_menu(page, preserve_answer=True)
        assert_progress(page, "Ma fille", 1, 2)
        print("PASS : menu mobile accessible, focus piégé/restauré, trois modes de fermeture et saisie préservée")

        page.reload(wait_until="networkidle")
        assert page.get_by_test_id("profile-card").count() == 1
        assert "1 / 25 étapes · 10 points" in page.get_by_test_id("profile-card").inner_text()
        choose_profile(page, "Ma fille")
        page.get_by_test_id("start-course").click()
        assert lessons[1]["title"] == page.locator(".lesson-title").inner_text()
        assert_progress(page, "Ma fille", 1, 2)
        page.get_by_test_id("switch-profile").click()
        create_profile(page, "Papa")
        assert_progress(page, "Papa", 0, 0)
        context.set_offline(True)
        page.get_by_test_id("start-course").click()
        assert lessons[0]["title"] == page.locator(".lesson-title").inner_text()
        submit_answer(page, lessons[0]["exercise"])
        assert_progress(page, "Papa", 1, 1)
        assert_progress(page, "Ma fille", 1, 2)
        page.get_by_test_id("switch-profile").click()
        choose_profile(page, "Ma fille")
        page.get_by_test_id("start-course").click()
        assert lessons[1]["title"] == page.locator(".lesson-title").inner_text()
        assert_no_overflow(page)
        page.set_viewport_size({"width": 390, "height": 844})
        page.screenshot(path="/tmp/suites-mobile.png", full_page=True)
        page.set_viewport_size({"width": 1440, "height": 1000})
        print("PASS : persistance, reprise de la bonne étape, profils isolés et affichage 360/390 px")

        # Tout le reste du parcours se déroule réseau coupé, via les vraies réponses.
        for index, lesson in enumerate(lessons[1:], start=1):
            assert lesson["title"] == page.locator(".lesson-title").inner_text(), lesson["id"]
            assert page.get_by_test_id("next-lesson").is_disabled(), lesson["id"]
            submit_answer(page, lesson["exercise"])
            assert page.get_by_test_id("next-lesson").is_enabled(), lesson["id"]
            assert_progress(page, "Ma fille", index + 1, index + 2)
            if index == len(lessons) - 1:
                assert "Terminer le parcours" in page.get_by_test_id("next-lesson").inner_text()
            page.get_by_test_id("next-lesson").click()
        assert "Une belle suite de réussites" in page.locator("h1").inner_text()
        assert page.locator(".completion-card .badge.earned").count() == 5
        page.get_by_role("button", name="Mon parcours", exact=True).last.click()
        assert page.locator(".stat-value").nth(1).inner_text().strip() == "250 pts"
        assert "25 étapes sur 25" in page.locator(".overview-grid").inner_text()
        assert page.locator(".badges-panel .badge.earned").count() == 5
        assert_progress(page, "Papa", 1, 1)
        context.set_offline(False)
        page.reload(wait_until="networkidle")
        choose_profile(page, "Ma fille")
        assert page.locator(".stat-value").nth(1).inner_text().strip() == "250 pts"
        assert_progress(page, "Ma fille", 25, 26)
        print("PASS : 25 étapes réellement validées, 250 points, 5 badges et conservation après rechargement")

        # Un exercice révisé ne doit pas attribuer dix nouveaux points.
        page.get_by_test_id("start-course").click()
        retry = page.get_by_role("button", name="Refaire cet exercice", exact=True)
        assert retry.is_visible()
        assert_mobile_menu(page)
        assert retry.is_visible()
        page.get_by_role("button", name="Ouvrir le guide", exact=True).click()
        page.get_by_role("button", name="Retour en arrière", exact=True).click()
        assert retry.is_visible()
        retry.click()
        submit_answer(page, lessons[0]["exercise"], correct=False)
        assert page.get_by_test_id("next-lesson").is_disabled()
        submit_answer(page, lessons[0]["exercise"])
        assert_progress(page, "Ma fille", 25, 28)
        page.locator('.sidebar [data-action="history"]').click()
        delete = page.get_by_role("button", name="Supprimer ce profil et sa progression", exact=True)
        before = saved_profile(page, "Ma fille")
        delete.click()
        assert page.get_by_role("dialog").is_visible()
        page.get_by_role("button", name="Annuler", exact=True).click()
        assert page.get_by_role("dialog").count() == 0
        assert delete.evaluate("element => element === document.activeElement")
        delete.click()
        page.keyboard.press("Escape")
        assert page.get_by_role("dialog").count() == 0
        assert delete.evaluate("element => element === document.activeElement")
        assert saved_profile(page, "Ma fille") == before
        with page.expect_download() as download_event:
            page.get_by_role("button", name="Exporter ma progression", exact=True).click()
        download = download_event.value
        assert download.suggested_filename.endswith(".json")
        exported = json.loads(Path(download.path()).read_text())
        assert exported["profile"] == before
        assert saved_profile(page, "Ma fille") == before
        download.delete()
        print("PASS : bouton de révision conservé, annulation/Escape avec focus restauré, export JSON fidèle sans mutation")
        assert not errors, errors
        unexpected = [url for url in requests if urlsplit(url).scheme in ("http", "https") and not url.startswith(base_url)]
        assert not unexpected, unexpected
        print("PASS : révision sans double attribution, aucune erreur JS ni ressource externe")
    finally:
        context.close()


def run_file_flow(browser):
    context = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    try:
        try:
            page.goto((ROOT / "index.html").as_uri(), wait_until="load")
        except PlaywrightError as error:
            if "ERR_BLOCKED_BY_ADMINISTRATOR" in str(error):
                print("NON EXÉCUTABLE : file:// est interdit par la politique de ce Chromium géré ; aucun résultat applicatif revendiqué.")
                return False
            raise
        create_profile(page, "Profil local")
        lessons = page.evaluate("window.SUITES_COURSE.modules.flatMap(module => module.lessons)")
        page.get_by_test_id("start-course").click()
        submit_answer(page, lessons[0]["exercise"])
        assert_progress(page, "Profil local", 1, 1)
        page.reload(wait_until="load")
        assert "1 / 25 étapes · 10 points" in page.get_by_test_id("profile-card").inner_text()
        assert not errors, errors
        print("PASS : ouverture directe file:// et sauvegarde locale dans Chromium")
        return True
    finally:
        context.close()


def main():
    handler = partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base_url = f"http://127.0.0.1:{server.server_address[1]}/"
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=BROWSER, headless=True, args=["--no-sandbox"])
            try:
                run_http_flow(browser, base_url)
                file_supported = run_file_flow(browser)
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
    print("Tous les contrôles fonctionnels HTTP ont réussi.")
    if not file_supported:
        print("Limite distincte : contrôle file:// non exécuté (politique du navigateur cloud).")


if __name__ == "__main__":
    main()
