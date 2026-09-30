"""Draws the QR on card.html as an inline SVG, so the card needs no QR library at runtime.

Run from anywhere:  py -3 tools/make_qr.py   (needs: py -3 -m pip install qrcode)
It rewrites only what sits between <!-- qr:start --> and <!-- qr:end --> in card.html.
"""
import pathlib
import re

import qrcode

URL = "https://banyanmakers.pages.dev/lookers.html?from=echai"
INK, GROUND = "#2F4A3E", "#F1F0E9"   # juniper on merino, same as the site
CARD = pathlib.Path(__file__).resolve().parent.parent / "card.html"


def qr_svg(data):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4)   # 4 modules of quiet zone
    qr.add_data(data)
    qr.make(fit=True)
    m = qr.get_matrix()   # includes the border
    n = len(m)
    runs = []
    for y, row in enumerate(m):
        x = 0
        while x < n:
            if row[x]:
                start = x
                while x < n and row[x]:
                    x += 1
                runs.append(f"M{start} {y}h{x - start}v1h-{x - start}z")
            else:
                x += 1
    return (f'<svg class="qr" viewBox="0 0 {n} {n}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" '
            f'role="img" aria-label="QR code for {data}"><rect width="{n}" height="{n}" fill="{GROUND}"/>'
            f'<path fill="{INK}" d="{"".join(runs)}"/></svg>')


if __name__ == "__main__":
    html = CARD.read_text(encoding="utf-8")
    new, hits = re.subn(r"<!-- qr:start -->.*?<!-- qr:end -->",
                        lambda _: "<!-- qr:start -->" + qr_svg(URL) + "<!-- qr:end -->", html, flags=re.S)
    if hits != 1:
        raise SystemExit(f"expected one qr:start/qr:end pair in {CARD}, found {hits}")
    CARD.write_text(new, encoding="utf-8", newline="")
    print("QR for", URL, "written into", CARD)
