"""Чи повний список CLIENT_NAMESPACES у src/i18n/clientNamespaces.js.

Будує граф імпортів від усіх файлів з "use client", збирає з нього виклики
useTranslations("Неймспейс") і порівнює зі списком у коді. Якщо клієнтський
компонент читає неймспейс, якого немає у списку, на проді замість тексту
з'явиться ключ — цей скрипт ловить таке до деплою.

Запуск: python scripts/check_client_messages.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

IMPORT_RE = re.compile(
    r"""import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)"""
)
NS_RE = re.compile(r"""useTranslations\(\s*["']([^"']+)["']\s*\)""")
ROOT_NS_RE = re.compile(r"useTranslations\(\s*\)")


def load_sources() -> dict[Path, str]:
    out = {}
    for path in [*SRC.rglob("*.jsx"), *SRC.rglob("*.js")]:
        if not path.is_file():
            continue
        try:
            out[path] = path.read_text(encoding="utf-8")
        except OSError:
            pass
    return out


def build_index(sources: dict[Path, str]) -> dict[Path, Path]:
    index: dict[Path, Path] = {}
    for path in sources:
        index[path.with_suffix("").resolve()] = path
        if path.stem == "index":
            index[path.parent.resolve()] = path
    return index


def resolve(importer: Path, spec: str, index: dict[Path, Path]) -> Path | None:
    if spec.startswith("@/"):
        base = SRC / spec[2:]
    elif spec.startswith("."):
        base = importer.parent / spec
    else:
        return None
    for candidate in (base, base / "index"):
        hit = index.get(candidate.with_suffix("").resolve()) or index.get(candidate.resolve())
        if hit:
            return hit
    return None


def client_files(sources: dict[Path, str], index: dict[Path, Path]) -> set[Path]:
    stack = [p for p, s in sources.items() if s.lstrip().startswith(('"use client"', "'use client'"))]
    seen: set[Path] = set()
    while stack:
        path = stack.pop()
        if path in seen:
            continue
        seen.add(path)
        for match in IMPORT_RE.finditer(sources.get(path, "")):
            target = resolve(path, match.group(1) or match.group(2), index)
            if target and target not in seen:
                stack.append(target)
    return seen


def declared() -> list[str]:
    text = (SRC / "i18n" / "clientNamespaces.js").read_text(encoding="utf-8")
    body = text[text.index("CLIENT_NAMESPACES = [") : text.index("];")]
    return re.findall(r'"([^"]+)"', body)


def main() -> int:
    sources = load_sources()
    index = build_index(sources)
    used: dict[str, set[str]] = {}
    uses_root = []
    for path in client_files(sources, index):
        for match in NS_RE.finditer(sources[path]):
            used.setdefault(match.group(1), set()).add(path.name)
        if ROOT_NS_RE.search(sources[path]):
            uses_root.append(path.name)

    listed = set(declared())
    missing = sorted(set(used) - listed)
    extra = sorted(listed - set(used))

    messages = json.loads((ROOT / "messages" / "uk.json").read_text(encoding="utf-8"))
    kb = lambda names: len(json.dumps({k: messages[k] for k in names if k in messages}, ensure_ascii=False)) / 1024

    print(f"клієнтський бандл читає {len(used)} неймспейсів (~{kb(used):.1f} КБ з {kb(messages):.1f} КБ)")
    if extra:
        print("зайві у списку (не страшно, просто вага):", ", ".join(extra))
    if uses_root:
        print("FAIL: useTranslations() без неймспейса у клієнтському коді:", ", ".join(uses_root))
    if missing:
        print("FAIL: немає у CLIENT_NAMESPACES:", ", ".join(missing))
    if not missing and not uses_root:
        print("ok — усі потрібні неймспейси передаються клієнту")
    return 1 if (missing or uses_root) else 0


if __name__ == "__main__":
    sys.exit(main())
