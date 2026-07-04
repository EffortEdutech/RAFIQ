#!/usr/bin/env python3
"""
RAFIQ Phase 5 private product bridge.

Local/private HTTP server for the first Quran and Hadith pages. The server
queries only private_api RPC functions; browser clients never receive direct
database credentials and do not access private schemas.
"""

from __future__ import annotations

import html
import json
import os
import sys
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse

try:
    import psycopg2
except ImportError as exc:  # pragma: no cover - user-facing startup help
    raise SystemExit(
        "psycopg2 is required. Set PYTHONPATH to C:\\tmp\\rafiq-phase3-pydeps "
        "or install the Phase 3 Python dependencies."
    ) from exc


DATABASE_URL = os.environ.get(
    "RAFIQ_DATABASE_URL",
    "postgresql://postgres:postgres@127.0.0.1:55422/postgres",
)
HOST = os.environ.get("RAFIQ_PRIVATE_BRIDGE_HOST", "127.0.0.1")
PORT = int(os.environ.get("RAFIQ_PRIVATE_BRIDGE_PORT", "8055"))

QURAN_EDITION_OPTIONS = [
    ("qul_uthmani", "QUL Uthmani"),
    ("qul_qpc_hafs", "QUL QPC Hafs"),
    ("tanzil_uthmani", "Tanzil Uthmani"),
]
TRANSLATION_EDITION_OPTIONS = [
    ("qul-en-sahih-simple", "English - Saheeh International (QUL simple)"),
    ("qul-en-sahih-inline-footnotes", "English - Saheeh International (inline footnotes)"),
    ("qul-en-sahih-tagged-html", "English - Saheeh International (tagged HTML)"),
    ("qul-en-sahih-chunks", "English - Saheeh International (chunks)"),
    ("tanzil-en-sahih", "English - Saheeh International (Tanzil)"),
    ("qul-ms-basamia-simple", "Malay - Abdullah Basamia (QUL simple)"),
    ("tanzil-ms-basmeih", "Malay - Abdullah Basmeih (Tanzil)"),
    ("tanzil-id-indonesian", "Indonesian - Kemenag RI (Tanzil)"),
]
TAFSIR_EDITION_OPTIONS = [
    ("qul-en-mukhtasar", "English - Al-Mukhtasar"),
    ("qul-en-ibn-kathir", "English - Ibn Kathir"),
    ("qul-ar-saadi", "Arabic - As-Saadi"),
]
HADITH_LANGUAGE_OPTIONS = [
    ("english", "English"),
    ("arabic", "Arabic"),
    ("indonesian", "Indonesian"),
    ("turkish", "Turkish"),
    ("urdu", "Urdu"),
]


def db_json(sql: str, params: tuple[Any, ...] = ()) -> dict[str, Any]:
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("set local role service_role")
            cur.execute(sql, params)
            value = cur.fetchone()[0]
    if value is None:
        return {}
    if isinstance(value, (dict, list)):
        return value
    return json.loads(value)


def get_quran_surah(
    surah_number: int,
    quran_edition_key: str | None = None,
    translation_edition_key: str | None = None,
    tafsir_edition_key: str | None = None,
) -> dict[str, Any]:
    return db_json(
        "select private_api.get_quran_surah(%s, %s, %s, %s)",
        (surah_number, quran_edition_key, translation_edition_key, tafsir_edition_key),
    )


def list_hadith_collections() -> dict[str, Any]:
    return db_json("select private_api.list_hadith_collections()")


def list_hadith_records(
    collection_key: str | None,
    language_code: str | None,
    limit: int,
    offset: int,
) -> dict[str, Any]:
    return db_json(
        "select private_api.list_hadith_records(%s, %s, %s, %s)",
        (collection_key, language_code, limit, offset),
    )


def get_hadith_record(hadith_record_id: str) -> dict[str, Any]:
    return db_json("select private_api.get_hadith_record(%s::uuid)", (hadith_record_id,))


def esc(value: Any) -> str:
    if value is None:
        return ""
    return html.escape(str(value), quote=True)


def option_tags(options: list[tuple[str, str]], selected: str | None) -> str:
    return "".join(
        f'<option value="{esc(value)}"{" selected" if value == selected else ""}>{esc(label)}</option>'
        for value, label in options
    )


def layout(title: str, body: str, notice: dict[str, Any] | None = None) -> bytes:
    notice = notice or {
        "label": "UNAPPROVED CONTENT - NOT FOR PUBLICATION",
        "message": "Private RAFIQ development and testing only.",
    }
    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{esc(title)} | RAFIQ Private</title>
  <style>
    :root {{
      color-scheme: light;
      --bg: #f7f2e8;
      --panel: #fffdf7;
      --ink: #1f2933;
      --muted: #5f6b7a;
      --accent: #0f766e;
      --danger: #9f1239;
      --line: #e4d8c4;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }}
    header, main {{ max-width: 1120px; margin: 0 auto; padding: 20px; }}
    nav a {{ color: var(--accent); font-weight: 700; margin-right: 16px; text-decoration: none; }}
    .notice {{
      border: 2px solid var(--danger);
      background: #fff1f2;
      color: var(--danger);
      border-radius: 14px;
      padding: 14px 16px;
      margin-top: 16px;
      font-weight: 700;
    }}
    .notice small {{ display: block; color: #7f1d1d; font-weight: 500; margin-top: 4px; }}
    .grid {{ display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 10px 30px rgba(31, 41, 51, 0.06);
    }}
    .meta {{ color: var(--muted); font-size: 0.92rem; }}
    .arabic {{ direction: rtl; text-align: right; font-size: 1.75rem; line-height: 2.2; }}
    .ayah {{ margin-bottom: 18px; }}
    .pill {{ display: inline-block; padding: 3px 9px; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 0.82rem; }}
    pre {{ white-space: pre-wrap; word-break: break-word; }}
    input, select, button {{
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 9px 11px;
      font: inherit;
      max-width: 100%;
    }}
    button {{ background: var(--accent); color: white; font-weight: 700; cursor: pointer; }}
    .form-row {{ display: flex; flex-wrap: wrap; gap: 10px; align-items: end; margin-top: 10px; }}
    .field {{ display: grid; gap: 4px; min-width: 180px; }}
    .field label {{ color: var(--muted); font-size: 0.85rem; font-weight: 700; }}
    .actions {{ display: flex; gap: 12px; flex-wrap: wrap; }}
  </style>
</head>
<body>
  <header>
    <h1>RAFIQ Private Bridge</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/quran/1">Quran</a>
      <a href="/hadith">Hadith</a>
      <a href="/api/health">API Health</a>
    </nav>
    <div class="notice">
      {esc(notice.get("label"))}
      <small>{esc(notice.get("message"))}</small>
    </div>
  </header>
  <main>{body}</main>
</body>
</html>"""
    return document.encode("utf-8")


def render_home() -> bytes:
    body = """
    <div class="grid">
      <section class="card">
        <h2>Quran Reader</h2>
        <p>Private Quran page backed by <code>private_api.get_quran_surah</code>.</p>
        <form action="/quran/1" method="get" onsubmit="event.preventDefault(); location.href='/quran/' + document.getElementById('surah').value;">
          <div class="form-row">
            <div class="field">
              <label for="surah">Surah number</label>
              <input id="surah" type="number" min="1" max="114" value="1" />
            </div>
          </div>
          <button type="submit">Open Surah</button>
        </form>
      </section>
      <section class="card">
        <h2>Hadith Browser</h2>
        <p>Private Hadith pages backed by source-qualified canonical records.</p>
        <p><a href="/hadith">Open Hadith Collections</a> or <a href="/hadith/records?collection=fawaz-linebyline:bukhari&language=english">browse Bukhari English</a>.</p>
      </section>
    </div>
    """
    return layout("Home", body)


def render_quran_surah(surah_number: int, query: dict[str, list[str]] | None = None) -> bytes:
    query = query or {}
    quran_edition = (query.get("quran") or ["qul_uthmani"])[0]
    translation_edition = (query.get("translation") or ["qul-en-sahih-simple"])[0]
    tafsir_edition = (query.get("tafsir") or ["qul-en-mukhtasar"])[0]
    show_tafsir = (query.get("show_tafsir") or ["1"])[0] != "0"
    payload = get_quran_surah(surah_number, quran_edition, translation_edition, tafsir_edition)
    if not payload:
        return layout("Surah Not Found", "<section class='card'><h2>Surah not found</h2></section>")
    notice = payload.get("notice", {})
    surah = payload.get("surah", {})
    editions = payload.get("editions", {})
    ayahs = payload.get("ayahs", [])
    ayah_html = []
    for ayah in ayahs:
        topics = ayah.get("sourceTopics") or []
        themes = ayah.get("sourceAyahThemes") or []
        tafsir = ayah.get("tafsirPassages") or []
        ayah_html.append(
            f"""
            <article class="card ayah">
              <div class="meta">{esc(ayah.get('verseKey'))}</div>
              <div class="arabic">{esc(ayah.get('quranText'))}</div>
              <p>{esc((ayah.get('translation') or {}).get('text'))}</p>
              <p class="meta">Topics: {esc(', '.join(t.get('name') or t.get('sourceTopicKey') or '' for t in topics[:8]))}</p>
              <p class="meta">Themes: {esc(', '.join(t.get('themeText') or '' for t in themes[:4]))}</p>
              {f'''
              <details>
                <summary>Tafsir passages ({len(tafsir)})</summary>
                {''.join(f"<p>{esc(t.get('text'))}</p>" for t in tafsir[:3])}
              </details>
              ''' if show_tafsir else ''}
            </article>
            """
        )
    body = f"""
    <section class="card">
      <h2>Surah {esc(surah.get('surahNumber'))}: {esc(surah.get('nameTransliteration'))}</h2>
      <p class="meta">Arabic name: {esc(surah.get('nameArabic'))} | Ayahs: {esc(surah.get('ayahCount'))}</p>
      <p class="meta">Quran: {esc((editions.get('quran') or {}).get('editionKey'))} |
        Translation: {esc((editions.get('translation') or {}).get('editionKey'))} |
        Tafsir: {esc((editions.get('tafsir') or {}).get('editionKey'))}</p>
      <form method="get" action="/quran/{esc(surah_number)}">
        <div class="form-row">
          <div class="field">
            <label for="quran">Quran edition</label>
            <select id="quran" name="quran">{option_tags(QURAN_EDITION_OPTIONS, quran_edition)}</select>
          </div>
          <div class="field">
            <label for="translation">Translation</label>
            <select id="translation" name="translation">{option_tags(TRANSLATION_EDITION_OPTIONS, translation_edition)}</select>
          </div>
          <div class="field">
            <label for="tafsir">Tafsir</label>
            <select id="tafsir" name="tafsir">{option_tags(TAFSIR_EDITION_OPTIONS, tafsir_edition)}</select>
          </div>
          <div class="field">
            <label for="show_tafsir">Tafsir display</label>
            <select id="show_tafsir" name="show_tafsir">
              <option value="1"{" selected" if show_tafsir else ""}>Show tafsir</option>
              <option value="0"{" selected" if not show_tafsir else ""}>Hide tafsir</option>
            </select>
          </div>
          <button type="submit">Reload Surah</button>
        </div>
      </form>
    </section>
    {''.join(ayah_html)}
    """
    return layout(f"Surah {surah_number}", body, notice)


def render_hadith_collections() -> bytes:
    payload = list_hadith_collections()
    notice = payload.get("notice", {})
    collections = payload.get("collections", [])
    cards = []
    for item in collections:
        key = item.get("collectionKey")
        cards.append(
            f"""
            <section class="card">
              <h3>{esc(key)}</h3>
              <p>{esc(item.get('nameEnglish'))}</p>
              <p class="meta">{esc(item.get('recordCount'))} records | {esc(item.get('textVersionCount'))} text versions</p>
              <p><a href="/hadith/records?collection={esc(key)}">Browse records</a></p>
            </section>
            """
        )
    body = f"""
    <section class="card">
      <h2>Hadith Collections</h2>
      <p class="meta">Choose a promoted source-qualified collection. Public release remains gated; this is a private browsing surface.</p>
    </section>
    <div class='grid'>{''.join(cards)}</div>
    """
    return layout("Hadith Collections", body, notice)


def render_hadith_records(query: dict[str, list[str]]) -> bytes:
    collection = (query.get("collection") or ["fawaz-linebyline:bukhari"])[0]
    language = (query.get("language") or ["english"])[0]
    offset = int((query.get("offset") or ["0"])[0])
    limit = max(1, min(int((query.get("limit") or ["20"])[0]), 100))
    payload = list_hadith_records(collection, language, limit, offset)
    notice = payload.get("notice", {})
    pagination = payload.get("pagination", {})
    collection_payload = list_hadith_collections()
    collection_options = [
        (item.get("collectionKey"), f"{item.get('collectionKey')} ({item.get('recordCount')} records)")
        for item in collection_payload.get("collections", [])
        if item.get("collectionKey")
    ]
    rows = []
    for record in payload.get("records", []):
        preview = record.get("previewText") or ""
        if len(preview) > 360:
            preview = preview[:360] + "..."
        rows.append(
            f"""
            <article class="card">
              <h3>{esc(record.get('collectionKey'))} #{esc(record.get('sourceHadithNumber'))}</h3>
              <p class="meta">{esc(record.get('printedReference'))}</p>
              <p>{esc(preview)}</p>
              <p><a href="/hadith/record/{esc(record.get('hadithRecordId'))}">Open detail</a></p>
            </article>
            """
        )
    page_limit = int(pagination.get("limit") or limit)
    total = int(pagination.get("total") or 0)
    next_offset = offset + page_limit
    prev_offset = max(0, offset - page_limit)
    next_disabled = next_offset >= total
    body = f"""
    <section class="card">
      <h2>Hadith Records</h2>
      <form method="get" action="/hadith/records">
        <div class="form-row">
          <div class="field">
            <label for="collection">Collection</label>
            <select id="collection" name="collection">{option_tags(collection_options, collection)}</select>
          </div>
          <div class="field">
            <label for="language">Language</label>
            <select id="language" name="language">{option_tags(HADITH_LANGUAGE_OPTIONS, language)}</select>
          </div>
          <div class="field">
            <label for="limit">Page size</label>
            <input id="limit" name="limit" type="number" min="1" max="100" value="{esc(page_limit)}" />
          </div>
          <button type="submit">Load</button>
        </div>
      </form>
      <p class="meta">Total: {esc(pagination.get('total'))} | Offset: {esc(offset)}</p>
      <p class="actions">
        <a href="/hadith/records?collection={esc(collection)}&language={esc(language)}&limit={page_limit}&offset={prev_offset}">Previous</a>
        {'<span class="meta">Next</span>' if next_disabled else f'<a href="/hadith/records?collection={esc(collection)}&language={esc(language)}&limit={page_limit}&offset={next_offset}">Next</a>'}
      </p>
    </section>
    <div class="grid">{''.join(rows)}</div>
    """
    return layout("Hadith Records", body, notice)


def render_hadith_detail(record_id: str) -> bytes:
    payload = get_hadith_record(record_id)
    notice = payload.get("notice", {})
    record = payload.get("record") or {}
    texts = payload.get("textVersions") or []
    grades = payload.get("gradeAssertions") or []
    claims = payload.get("verificationClaims") or []
    text_html = "".join(
        f"""
        <section class="card">
          <span class="pill">{esc(text.get('languageCode'))}</span>
          <pre>{esc(text.get('fullText'))}</pre>
        </section>
        """
        for text in texts
    )
    grade_html = "".join(
        f"<li>{esc(g.get('graderNameRaw'))}: {esc(g.get('rawGrade'))} <span class='meta'>({esc(g.get('normalizedLabel'))})</span></li>"
        for g in grades
    )
    claim_html = "".join(
        f"<li>{esc(c.get('rawConclusion'))}: {esc(c.get('claimText'))}</li>"
        for c in claims
    )
    body = f"""
    <section class="card">
      <h2>{esc(record.get('collectionKey'))} #{esc(record.get('sourceHadithNumber'))}</h2>
      <p class="meta">{esc(record.get('printedReference'))}</p>
      <p class="meta">Edition: {esc(record.get('editionKey'))} | Source key: {esc(record.get('sourceHadithKey'))}</p>
    </section>
    <h3>Text Versions</h3>
    {text_html}
    <section class="card">
      <h3>Grade Assertions</h3>
      <ul>{grade_html or '<li class="meta">No grade assertions for this record.</li>'}</ul>
    </section>
    <section class="card">
      <h3>Verification Claims</h3>
      <ul>{claim_html or '<li class="meta">No verification claims for this record.</li>'}</ul>
    </section>
    """
    return layout("Hadith Detail", body, notice)


class RafiqPrivateBridgeHandler(BaseHTTPRequestHandler):
    server_version = "RAFIQPrivateBridge/0.1"

    def do_GET(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/":
                self.send_html(render_home())
            elif parsed.path == "/api/health":
                self.send_json({"ok": True, "service": "rafiq-private-bridge"})
            elif parsed.path.startswith("/api/quran/surah/"):
                query = parse_qs(parsed.query)
                surah_number = int(parsed.path.rsplit("/", 1)[-1])
                self.send_json(
                    get_quran_surah(
                        surah_number,
                        (query.get("quran") or [None])[0],
                        (query.get("translation") or [None])[0],
                        (query.get("tafsir") or [None])[0],
                    )
                )
            elif parsed.path == "/api/hadith/collections":
                self.send_json(list_hadith_collections())
            elif parsed.path == "/api/hadith/records":
                query = parse_qs(parsed.query)
                collection = (query.get("collection") or [None])[0]
                language = (query.get("language") or [None])[0]
                limit = int((query.get("limit") or ["20"])[0])
                offset = int((query.get("offset") or ["0"])[0])
                self.send_json(list_hadith_records(collection, language, limit, offset))
            elif parsed.path.startswith("/api/hadith/record/"):
                self.send_json(get_hadith_record(parsed.path.rsplit("/", 1)[-1]))
            elif parsed.path.startswith("/quran/"):
                self.send_html(render_quran_surah(int(parsed.path.rsplit("/", 1)[-1]), parse_qs(parsed.query)))
            elif parsed.path == "/hadith":
                self.send_html(render_hadith_collections())
            elif parsed.path == "/hadith/records":
                self.send_html(render_hadith_records(parse_qs(parsed.query)))
            elif parsed.path.startswith("/hadith/record/"):
                self.send_html(render_hadith_detail(parsed.path.rsplit("/", 1)[-1]))
            else:
                self.send_error(HTTPStatus.NOT_FOUND, "Not found")
        except Exception as exc:  # pragma: no cover - visible local dev error
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, str(exc))

    def log_message(self, format: str, *args: Any) -> None:
        sys.stderr.write("private-bridge: " + format % args + "\n")

    def send_json(self, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, body: bytes) -> None:
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), RafiqPrivateBridgeHandler)
    print(f"RAFIQ private bridge running at http://{HOST}:{PORT}/")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()
