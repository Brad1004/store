# SalamSeleb 홈페이지 빌드: 템플릿 + 공용 문구(copy.js) + 앱 사진(base64) + 샘플 Seleb 데이터
#   src/template.html → index.html   (데스크탑)
#   src/mobile.html   → mobile.html  (모바일)
import base64, json, re, pathlib
here = pathlib.Path(__file__).resolve().parent
root = here.parent
photos = root.parent / "salamseleb-app" / "photos"
copy = (here / "copy.js").read_text(encoding="utf-8")
ph = ["data:image/jpeg;base64," + base64.b64encode((photos / f"p{i}.jpg").read_bytes()).decode() for i in range(17)]
selebs = json.loads((here / "selebs.json").read_text(encoding="utf-8"))
for s in selebs:
    s["bio"] = re.sub(r"\s*\(샘플 프로필[^)]*\)\s*$", "", s["bio"]).strip()
order = ["mc", "singer", "comedian", "creator", "actor", "athlete", "dancer", "magician", "chef"]
selebs.sort(key=lambda s: (order.index(s["c"]), s["n"]))
app = "https://claude.ai/artifact/BccBepXFvxprvK6dRvE4g8"
for src, dst in (("template.html", "index.html"), ("mobile.html", "mobile.html")):
    tpl = (here / src).read_text(encoding="utf-8")
    out = (tpl.replace("__COPY__", copy)
              .replace("__APP__", app)
              .replace("__PHOTOS__", json.dumps(ph))
              .replace("__SELEBS__", json.dumps(selebs, ensure_ascii=False))
              .replace("__P1__", ph[1]))
    (root / dst).write_text(out, encoding="utf-8")
    print("ok", dst, len(out) // 1024, "KB")
