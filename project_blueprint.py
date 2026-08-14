#!/usr/bin/env python3
"""
BUZZIEWORLD PROJECT BLUEPRINT GENERATOR
=======================================

Read-only project intelligence scanner for Next.js / React / TypeScript
and similar projects.

IMPORTANT SAFETY GUARANTEE
--------------------------
This script ONLY READS files from the selected project.

It does NOT:
- modify files
- delete files
- rename files
- move files
- execute project code
- run npm
- run git
- run Next.js
- install packages
- modify package.json
- modify environment variables
- modify configuration
- create files inside the scanned project

The only file it creates is the generated Markdown blueprint, and by
default that file is created OUTSIDE the scanned project.

Designed specifically to create a detailed BuzzieWorld handoff/source-of-truth
document containing:

1. Project metadata
2. Complete directory tree
3. File inventory
4. Empty-file detection
5. Empty-directory detection
6. File sizes
7. Line counts
8. SHA-256 hashes
9. File classification
10. Client/server detection
11. Imports
12. Exports
13. React hooks
14. API route detection
15. HTTP method detection
16. TODO/FIXME/placeholder detection
17. package.json dependencies/scripts
18. Source/configuration contents
19. Binary/media inventory
20. Environment-variable NAME detection without exposing values
21. Automatic implementation-status hints

The resulting .md file can be uploaded to ChatGPT as the current
BuzzieWorld project blueprint.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Iterable


# ============================================================
# CONFIGURATION
# ============================================================

# Maximum source/config file size whose CONTENT will be embedded
# into the blueprint.
#
# Files larger than this are still inventoried and hashed, but their
# complete contents are NOT copied into the blueprint.
MAX_CONTENT_SIZE_BYTES = 750_000


# Maximum number of source files whose full contents are embedded.
#
# This is intentionally generous for a normal Next.js application.
MAX_SOURCE_FILES_WITH_CONTENT = 1000


# ============================================================
# DIRECTORIES TO SKIP
# ============================================================

SKIP_DIRS = {
    # Dependencies / generated
    "node_modules",
    ".next",
    ".git",
    ".svn",
    ".hg",
    "dist",
    "build",
    "out",
    "coverage",
    ".cache",
    ".turbo",
    ".vercel",

    # Editors / IDEs
    ".vscode",
    ".idea",

    # Python
    "__pycache__",
    ".pytest_cache",
    "venv",
    ".venv",

    # Environment directories
    "env",

    # Temporary / logs
    "tmp",
    "temp",
    "logs",

    # OS
    ".DS_Store",
}


# ============================================================
# FILES TO SKIP
# ============================================================

SKIP_FILES = {
    ".DS_Store",
    "Thumbs.db",

    # Lock files are generally unnecessary for architectural analysis.
    # package.json is intentionally NOT skipped.
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",

    # TypeScript incremental build information
    "tsconfig.tsbuildinfo",
}


# ============================================================
# SECRET / SENSITIVE FILES
# ============================================================

# Never read or expose actual environment values.
SECRET_FILE_NAMES = {
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
    ".env.development.local",
    ".env.production.local",
    ".env.test.local",
}


# These example files are safe to inspect because they normally contain
# variable names rather than real secrets.
SAFE_ENV_FILES = {
    ".env.example",
    ".env.local.example",
    ".env.development.example",
    ".env.production.example",
    ".env.test.example",
}


# ============================================================
# SOURCE / TEXT FILE EXTENSIONS
# ============================================================

SOURCE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
}


STYLE_EXTENSIONS = {
    ".css",
    ".scss",
    ".sass",
    ".less",
}


CONFIG_EXTENSIONS = {
    ".json",
    ".yaml",
    ".yml",
    ".toml",
}


DOCUMENT_EXTENSIONS = {
    ".md",
    ".mdx",
    ".txt",
}


TEXT_EXTENSIONS = (
    SOURCE_EXTENSIONS
    | STYLE_EXTENSIONS
    | CONFIG_EXTENSIONS
    | DOCUMENT_EXTENSIONS
)


# ============================================================
# BINARY / MEDIA EXTENSIONS
# ============================================================

BINARY_EXTENSIONS = {
    # Images
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".avif",
    ".ico",
    ".bmp",
    ".tiff",
    ".svg",

    # Video
    ".mp4",
    ".webm",
    ".mov",
    ".avi",
    ".mkv",

    # Audio
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".aac",

    # Fonts
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",

    # 3D
    ".glb",
    ".gltf",
    ".obj",
    ".fbx",

    # Documents / archives
    ".pdf",
    ".zip",
    ".rar",
    ".7z",

    # Other binary formats
    ".bin",
}


# ============================================================
# KEY FILES WE DEFINITELY WANT
# ============================================================

IMPORTANT_FILES = {
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "next-env.d.ts",
    "eslint.config.mjs",
    "eslint.config.js",
    "postcss.config.mjs",
    "postcss.config.js",
    "components.json",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
}


# ============================================================
# FILE CLASSIFICATION
# ============================================================

def classify_file(path: Path) -> str:
    """
    Best-effort classification.

    This is intentionally a hint, not a claim about actual functionality.
    """

    name = path.name.lower()
    suffix = path.suffix.lower()
    normalized = str(path).replace("\\", "/").lower()

    if name == "package.json":
        return "PROJECT_CONFIGURATION"

    if name.startswith("tsconfig"):
        return "TYPESCRIPT_CONFIGURATION"

    if "eslint" in name:
        return "LINT_CONFIGURATION"

    if "next.config" in name:
        return "NEXTJS_CONFIGURATION"

    if "postcss.config" in name:
        return "CSS_CONFIGURATION"

    if name in {"readme.md", "agents.md", "claude.md"}:
        return "DOCUMENTATION"

    if "/app/api/" in normalized and suffix in SOURCE_EXTENSIONS:
        return "API_ROUTE"

    if normalized.endswith("/page.tsx") or normalized.endswith("/page.jsx"):
        return "PAGE"

    if normalized.endswith("/layout.tsx") or normalized.endswith("/layout.jsx"):
        return "LAYOUT"

    if "/components/" in normalized:
        return "COMPONENT"

    if "/hooks/" in normalized:
        return "HOOK"

    if "/services/" in normalized:
        return "SERVICE"

    if "/models/" in normalized:
        return "MODEL"

    if "/types/" in normalized:
        return "TYPE_DEFINITION"

    if "/store/" in normalized:
        return "STATE_STORE"

    if "/providers/" in normalized:
        return "PROVIDER"

    if "/lib/" in normalized:
        return "LIBRARY_UTILITY"

    if "/config/" in normalized:
        return "CONFIGURATION"

    if "/scripts/" in normalized:
        return "SCRIPT"

    if "/data/" in normalized:
        return "DATA"

    if suffix in STYLE_EXTENSIONS:
        return "STYLESHEET"

    if suffix in CONFIG_EXTENSIONS:
        return "CONFIGURATION"

    if suffix in DOCUMENT_EXTENSIONS:
        return "DOCUMENTATION"

    if suffix in BINARY_EXTENSIONS:
        return "ASSET"

    if suffix in SOURCE_EXTENSIONS:
        return "SOURCE"

    return "OTHER"


# ============================================================
# PATH / FILE SAFETY
# ============================================================

def should_skip(path: Path) -> bool:
    """
    Decide whether a path should be excluded from scanning.

    This function does not modify anything.
    """

    name = path.name

    if path.is_dir() and name in SKIP_DIRS:
        return True

    if path.is_file() and name in SKIP_FILES:
        return True

    if name in SECRET_FILE_NAMES:
        return True

    # Skip hidden directories/files except explicitly safe env examples.
    if name.startswith(".") and name not in SAFE_ENV_FILES:
        return True

    return False


def is_secret_file(path: Path) -> bool:
    return path.name in SECRET_FILE_NAMES


def is_safe_env_file(path: Path) -> bool:
    return path.name in SAFE_ENV_FILES


def is_text_candidate(path: Path) -> bool:
    if path.suffix.lower() in TEXT_EXTENSIONS:
        return True

    if path.name in IMPORTANT_FILES:
        return True

    if is_safe_env_file(path):
        return True

    return False


# ============================================================
# FILE HASHING
# ============================================================

def sha256_file(path: Path) -> str:
    """
    Calculate SHA-256 without loading the entire file into memory.
    """

    digest = hashlib.sha256()

    with path.open("rb") as file:
        while True:
            chunk = file.read(1024 * 1024)

            if not chunk:
                break

            digest.update(chunk)

    return digest.hexdigest()


# ============================================================
# TEXT READING
# ============================================================

def read_text_safely(path: Path) -> str | None:
    """
    Read a text file safely.

    Returns None if the file cannot be decoded/read.
    """

    try:
        return path.read_text(
            encoding="utf-8",
            errors="replace",
        )
    except (OSError, UnicodeError):
        return None


# ============================================================
# LINE COUNT
# ============================================================

def count_lines(content: str) -> int:
    if not content:
        return 0

    return len(content.splitlines())


# ============================================================
# IMPORT EXTRACTION
# ============================================================

def extract_imports(content: str) -> list[str]:
    imports: list[str] = []

    patterns = [
        r'import\s+(?:type\s+)?[\s\S]*?\s+from\s+["\']([^"\']+)["\']',
        r'import\s*\(\s*["\']([^"\']+)["\']\s*\)',
        r'import\s*["\']([^"\']+)["\']',
        r'require\(\s*["\']([^"\']+)["\']\s*\)',
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, content):
            value = match.group(1).strip()

            if value and value not in imports:
                imports.append(value)

    return sorted(imports)


# ============================================================
# EXPORT EXTRACTION
# ============================================================

def extract_exports(content: str) -> list[str]:
    exports: list[str] = []

    patterns = [
        r'export\s+(?:async\s+)?(?:default\s+)?(?:function|class|const|let|var|interface|type|enum)\s+([A-Za-z_$][\w$]*)',
        r'export\s*\{\s*([^}]+)\s*\}',
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, content):
            value = match.group(1).strip()

            if "," in value:
                pieces = value.split(",")

                for piece in pieces:
                    cleaned = re.sub(
                        r"\s+as\s+.+$",
                        "",
                        piece.strip(),
                    )

                    if cleaned and cleaned not in exports:
                        exports.append(cleaned)
            else:
                if value and value not in exports:
                    exports.append(value)

    if re.search(r'export\s+default', content):
        if "default" not in exports:
            exports.append("default")

    return sorted(exports)


# ============================================================
# REACT / NEXT HOOK DETECTION
# ============================================================

KNOWN_HOOKS = {
    "useState",
    "useEffect",
    "useMemo",
    "useCallback",
    "useRef",
    "useContext",
    "useReducer",
    "useLayoutEffect",
    "useTransition",
    "useDeferredValue",
    "useId",
    "useFormStatus",
    "useOptimistic",
    "useRouter",
    "usePathname",
    "useSearchParams",
    "useParams",
    "useSession",
    "useQuery",
    "useMutation",
    "useCart",
    "useWishlist",
    "useUser",
    "useTheme",
    "useScroll",
}


def extract_hooks(content: str) -> list[str]:
    found: list[str] = []

    for hook in KNOWN_HOOKS:
        pattern = rf"\b{re.escape(hook)}\b"

        if re.search(pattern, content):
            found.append(hook)

    # Detect custom hooks as well.
    custom_hooks = re.findall(
        r"\b(use[A-Z][A-Za-z0-9_]*)\b",
        content,
    )

    for hook in custom_hooks:
        if hook not in found:
            found.append(hook)

    return sorted(found)


# ============================================================
# CLIENT / SERVER DETECTION
# ============================================================

def detect_runtime(content: str, path: Path) -> str:
    stripped = content.lstrip()

    if stripped.startswith('"use client"') or stripped.startswith("'use client'"):
        return "CLIENT_COMPONENT"

    normalized = str(path).replace("\\", "/").lower()

    if "/app/api/" in normalized:
        return "SERVER_ROUTE"

    if "/services/" in normalized:
        return "SERVER_LIKELY"

    if "/models/" in normalized:
        return "SERVER_ONLY"

    if "/lib/mongoose" in normalized:
        return "SERVER_ONLY"

    if "/components/" in normalized:
        return "SERVER_COMPONENT_OR_CLIENT"

    if path.name == "page.tsx" or path.name == "layout.tsx":
        return "SERVER_COMPONENT_DEFAULT"

    return "UNKNOWN"


# ============================================================
# API ROUTE DETECTION
# ============================================================

HTTP_METHODS = (
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
)


def extract_api_methods(content: str) -> list[str]:
    methods: list[str] = []

    for method in HTTP_METHODS:
        patterns = [
            rf"\bexport\s+(?:async\s+)?function\s+{method}\b",
            rf"\bexport\s+const\s+{method}\b",
        ]

        if any(re.search(pattern, content) for pattern in patterns):
            methods.append(method)

    return methods


def api_route_path(project: Path, path: Path) -> str | None:
    try:
        relative = path.relative_to(project)
    except ValueError:
        return None

    parts = list(relative.parts)

    try:
        api_index = parts.index("api")
    except ValueError:
        return None

    api_parts = parts[api_index:]

    if api_parts and api_parts[-1] == "route.ts":
        api_parts = api_parts[:-1]

    if api_parts and api_parts[-1] == "route.js":
        api_parts = api_parts[:-1]

    if not api_parts:
        return "/api"

    return "/" + "/".join(api_parts)


# ============================================================
# TODO / PLACEHOLDER DETECTION
# ============================================================

TODO_PATTERNS = {
    "TODO": re.compile(r"\bTODO\b", re.IGNORECASE),
    "FIXME": re.compile(r"\bFIXME\b", re.IGNORECASE),
    "HACK": re.compile(r"\bHACK\b", re.IGNORECASE),
    "XXX": re.compile(r"\bXXX\b", re.IGNORECASE),
    "COMING_SOON": re.compile(r"coming\s*soon", re.IGNORECASE),
    "PLACEHOLDER": re.compile(r"placeholder", re.IGNORECASE),
    "NOT_IMPLEMENTED": re.compile(
        r"not\s+implemented|not\s+yet\s+implemented",
        re.IGNORECASE,
    ),
}


def detect_markers(content: str) -> dict[str, int]:
    result: dict[str, int] = {}

    for name, pattern in TODO_PATTERNS.items():
        count = len(pattern.findall(content))

        if count:
            result[name] = count

    return result


# ============================================================
# ENVIRONMENT VARIABLE NAME DETECTION
# ============================================================

def extract_env_names(content: str) -> list[str]:
    names: list[str] = []

    # process.env.X
    for match in re.finditer(
        r"\bprocess\.env\.([A-Za-z_][A-Za-z0-9_]*)",
        content,
    ):
        value = match.group(1)

        if value not in names:
            names.append(value)

    # process.env["X"]
    for match in re.finditer(
        r"\bprocess\.env\[\s*[\"']([^\"']+)[\"']\s*\]",
        content,
    ):
        value = match.group(1)

        if value not in names:
            names.append(value)

    return sorted(names)


# ============================================================
# DEPENDENCY EXTRACTION
# ============================================================

def parse_package_json(path: Path) -> dict:
    try:
        content = read_text_safely(path)

        if content is None:
            return {}

        return json.loads(content)

    except (json.JSONDecodeError, OSError):
        return {}


# ============================================================
# DIRECTORY TREE
# ============================================================

def build_tree_lines(
    path: Path,
    prefix: str = "",
    is_last: bool = True,
    lines: list[str] | None = None,
) -> list[str]:

    if lines is None:
        lines = []

    connector = "└── " if is_last else "├── "

    lines.append(
        f"{prefix}{connector}{path.name}"
    )

    if path.is_dir():

        try:
            children = sorted(
                [
                    child
                    for child in path.iterdir()
                    if not should_skip(child)
                ],
                key=lambda item: (
                    item.is_file(),
                    item.name.lower(),
                ),
            )

        except PermissionError:
            lines.append(
                f"{prefix}    [ACCESS DENIED]"
            )

            return lines

        for index, child in enumerate(children):

            child_is_last = (
                index == len(children) - 1
            )

            new_prefix = (
                prefix
                + ("    " if is_last else "│   ")
            )

            build_tree_lines(
                child,
                new_prefix,
                child_is_last,
                lines,
            )

    return lines


# ============================================================
# FILE SCANNING
# ============================================================

def collect_files(
    project: Path,
) -> tuple[list[Path], list[Path], list[Path]]:

    text_files: list[Path] = []
    binary_files: list[Path] = []
    empty_dirs: list[Path] = []

    for root, dirs, files in os.walk(project):

        root_path = Path(root)

        # Prevent traversal into skipped directories.
        dirs[:] = sorted(
            [
                directory
                for directory in dirs
                if not should_skip(
                    root_path / directory
                )
            ],
            key=str.lower,
        )

        visible_files = [
            root_path / filename
            for filename in files
            if not should_skip(
                root_path / filename
            )
        ]

        # Detect empty visible directories.
        if not visible_files and not dirs:
            if root_path != project:
                empty_dirs.append(root_path)

        for file_path in visible_files:

            if is_text_candidate(file_path):
                text_files.append(file_path)

            elif file_path.suffix.lower() in BINARY_EXTENSIONS:
                binary_files.append(file_path)

            else:
                # Unknown extensions are inventoried but not embedded.
                binary_files.append(file_path)

    text_files.sort(
        key=lambda item: str(item).lower()
    )

    binary_files.sort(
        key=lambda item: str(item).lower()
    )

    empty_dirs.sort(
        key=lambda item: str(item).lower()
    )

    return (
        text_files,
        binary_files,
        empty_dirs,
    )


# ============================================================
# FILE METADATA
# ============================================================

def relative_path(
    project: Path,
    path: Path,
) -> str:

    return str(
        path.relative_to(project)
    ).replace("\\", "/")


def format_size(size: int) -> str:

    if size < 1024:
        return f"{size} B"

    if size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"

    return f"{size / (1024 * 1024):.2f} MB"


# ============================================================
# MARKDOWN ESCAPING
# ============================================================

def safe_markdown_text(value: str) -> str:
    return value.replace("\x00", "")


# ============================================================
# STATUS HINT
# ============================================================

def determine_status_hint(
    path: Path,
    content: str | None,
) -> str:

    if path.is_dir():
        return "DIRECTORY"

    if content is not None and not content.strip():
        return "EMPTY"

    if content is None:
        if path.suffix.lower() in BINARY_EXTENSIONS:
            return "ASSET"

        return "NOT_READ"

    markers = detect_markers(content)

    if "NOT_IMPLEMENTED" in markers:
        return "LIKELY_NOT_IMPLEMENTED"

    if "COMING_SOON" in markers:
        return "PLACEHOLDER_OR_COMING_SOON"

    if "PLACEHOLDER" in markers:
        return "PLACEHOLDER_OR_PARTIAL"

    if "TODO" in markers or "FIXME" in markers:
        return "IMPLEMENTED_WITH_TODO"

    return "HAS_CONTENT"


# ============================================================
# SOURCE FILE SECTION
# ============================================================

def render_source_file(
    project: Path,
    path: Path,
    source_index: int,
) -> list[str]:

    lines: list[str] = []

    rel = relative_path(project, path)

    try:
        size = path.stat().st_size
    except OSError:
        size = 0

    file_type = classify_file(path)

    lines.append(f"## {source_index}. `{rel}`")
    lines.append("")

    lines.append("| Property | Value |")
    lines.append("|---|---|")
    lines.append(f"| Classification | `{file_type}` |")
    lines.append(f"| Size | `{format_size(size)}` |")

    try:
        file_hash = sha256_file(path)
        lines.append(f"| SHA-256 | `{file_hash}` |")
    except OSError:
        lines.append("| SHA-256 | `UNAVAILABLE` |")

    if is_secret_file(path):
        lines.append("| Content | `REDACTED` |")
        lines.append("")
        return lines

    # Special handling for safe environment examples.
    if is_safe_env_file(path):

        content = read_text_safely(path)

        if content is None:
            lines.append("| Read status | `FAILED` |")
            lines.append("")
            return lines

        env_names = extract_env_names(
            content
        )

        lines.append(
            f"| Lines | `{count_lines(content)}` |"
        )
        lines.append("| Content | `ENVIRONMENT TEMPLATE` |")
        lines.append("")

        if env_names:
            lines.append("### Environment variable names")
            lines.append("")

            for name in env_names:
                lines.append(f"- `{name}`")

            lines.append("")

        lines.append(
            "> Actual environment values are never included."
        )
        lines.append("")

        return lines

    if size > MAX_CONTENT_SIZE_BYTES:

        lines.append(
            "| Content | `NOT EMBEDDED — FILE TOO LARGE` |"
        )
        lines.append("")

        lines.append(
            f"> File exceeds the configured "
            f"`{format_size(MAX_CONTENT_SIZE_BYTES)}` "
            "content limit. Metadata and SHA-256 are still recorded."
        )
        lines.append("")

        return lines

    content = read_text_safely(path)

    if content is None:

        lines.append(
            "| Read status | `FAILED / NON-TEXT` |"
        )
        lines.append("")

        return lines

    line_count = count_lines(content)

    status = determine_status_hint(
        path,
        content,
    )

    lines.append(f"| Lines | `{line_count}` |")
    lines.append(f"| Status hint | `{status}` |")

    runtime = detect_runtime(
        content,
        path,
    )

    lines.append(
        f"| Runtime hint | `{runtime}` |"
    )

    markers = detect_markers(content)

    if markers:

        marker_text = ", ".join(
            f"{key}={value}"
            for key, value in markers.items()
        )

        lines.append(
            f"| Development markers | `{marker_text}` |"
        )

    env_names = extract_env_names(content)

    if env_names:

        lines.append(
            "| Environment variables referenced | "
            + ", ".join(
                f"`{name}`"
                for name in env_names
            )
            + " |"
        )

    imports = extract_imports(content)

    if imports:

        lines.append(
            f"| Imports | `{len(imports)}` detected |"
        )

    exports = extract_exports(content)

    if exports:

        lines.append(
            f"| Exports | `{len(exports)}` detected |"
        )

    hooks = extract_hooks(content)

    if hooks:

        lines.append(
            "| Hooks | "
            + ", ".join(
                f"`{hook}`"
                for hook in hooks
            )
            + " |"
        )

    if file_type == "API_ROUTE":

        methods = extract_api_methods(content)

        if methods:

            lines.append(
                "| HTTP methods | "
                + ", ".join(
                    f"`{method}`"
                    for method in methods
                )
                + " |"
            )

        endpoint = api_route_path(
            project,
            path,
        )

        if endpoint:

            lines.append(
                f"| API endpoint | `{endpoint}` |"
            )

    lines.append("")

    if imports:

        lines.append("### Imports")
        lines.append("")

        for item in imports:
            lines.append(f"- `{item}`")

        lines.append("")

    if exports:

        lines.append("### Exports")
        lines.append("")

        for item in exports:
            lines.append(f"- `{item}`")

        lines.append("")

    if hooks:

        lines.append("### Hooks detected")
        lines.append("")

        for hook in hooks:
            lines.append(f"- `{hook}`")

        lines.append("")

    if markers:

        lines.append("### Development markers")
        lines.append("")

        for marker, count in markers.items():
            lines.append(
                f"- `{marker}`: {count}"
            )

        lines.append("")

    lines.append("### Source")
    lines.append("")

    language = {
        ".ts": "typescript",
        ".tsx": "tsx",
        ".js": "javascript",
        ".jsx": "jsx",
        ".mjs": "javascript",
        ".cjs": "javascript",
        ".css": "css",
        ".scss": "scss",
        ".json": "json",
        ".md": "markdown",
        ".mdx": "mdx",
        ".txt": "text",
        ".yaml": "yaml",
        ".yml": "yaml",
    }.get(
        path.suffix.lower(),
        "text",
    )

    lines.append(
        f"```{language}"
    )

    lines.append(
        safe_markdown_text(content)
    )

    lines.append("```")
    lines.append("")

    return lines


# ============================================================
# BINARY / ASSET INVENTORY
# ============================================================

def render_asset_inventory(
    project: Path,
    binary_files: list[Path],
) -> list[str]:

    lines: list[str] = []

    lines.append("# 7. Asset / Binary Inventory")
    lines.append("")

    if not binary_files:

        lines.append(
            "No binary assets were detected."
        )
        lines.append("")

        return lines

    extension_counts = Counter(
        path.suffix.lower()
        for path in binary_files
    )

    lines.append(
        f"Total binary/asset files: **{len(binary_files)}**"
    )
    lines.append("")

    lines.append("## Asset type summary")
    lines.append("")

    lines.append("| Extension | Count |")
    lines.append("|---|---:|")

    for extension, count in sorted(
        extension_counts.items()
    ):
        lines.append(
            f"| `{extension or '[none]'}` | {count} |"
        )

    lines.append("")

    lines.append("## Asset files")
    lines.append("")

    for path in binary_files:

        try:
            size = path.stat().st_size
        except OSError:
            size = 0

        rel = relative_path(
            project,
            path,
        )

        lines.append(
            f"- `{rel}` — {format_size(size)}"
        )

    lines.append("")

    return lines


# ============================================================
# EMPTY DIRECTORY INVENTORY
# ============================================================

def render_empty_directories(
    project: Path,
    empty_dirs: list[Path],
) -> list[str]:

    lines: list[str] = []

    lines.append("# 8. Empty Directories")
    lines.append("")

    if not empty_dirs:

        lines.append(
            "No empty directories detected."
        )
        lines.append("")

        return lines

    for path in empty_dirs:

        rel = relative_path(
            project,
            path,
        )

        lines.append(
            f"- `{rel}/`"
        )

    lines.append("")

    return lines


# ============================================================
# FILE INVENTORY
# ============================================================

def render_file_inventory(
    project: Path,
    text_files: list[Path],
    binary_files: list[Path],
) -> list[str]:

    lines: list[str] = []

    lines.append("# 5. Complete File Inventory")
    lines.append("")

    all_files = (
        text_files
        + binary_files
    )

    all_files.sort(
        key=lambda path: str(path).lower()
    )

    lines.append(
        "| # | Path | Type | Size | Status |"
    )
    lines.append(
        "|---:|---|---|---:|---|"
    )

    for index, path in enumerate(
        all_files,
        start=1,
    ):

        try:
            size = path.stat().st_size
        except OSError:
            size = 0

        rel = relative_path(
            project,
            path,
        )

        file_type = classify_file(
            path
        )

        if path in binary_files:

            status = "ASSET"

        else:

            content = read_text_safely(
                path
            )

            status = determine_status_hint(
                path,
                content,
            )

        lines.append(
            f"| {index} | `{rel}` | "
            f"`{file_type}` | "
            f"{format_size(size)} | "
            f"`{status}` |"
        )

    lines.append("")

    return lines


# ============================================================
# PACKAGE.JSON SECTION
# ============================================================

def render_package_section(
    project: Path,
) -> list[str]:

    lines: list[str] = []

    lines.append("# 4. Package / Dependency Intelligence")
    lines.append("")

    package_path = project / "package.json"

    if not package_path.exists():

        lines.append(
            "`package.json` was not found."
        )
        lines.append("")

        return lines

    package_data = parse_package_json(
        package_path
    )

    if not package_data:

        lines.append(
            "Could not parse `package.json`."
        )
        lines.append("")

        return lines

    lines.append("## Project identity")
    lines.append("")

    lines.append(
        f"- **Name:** `{package_data.get('name', 'unknown')}`"
    )

    lines.append(
        f"- **Version:** `{package_data.get('version', 'unknown')}`"
    )

    lines.append(
        f"- **Private:** `{package_data.get('private', 'unknown')}`"
    )

    lines.append("")

    scripts = package_data.get(
        "scripts",
        {},
    )

    if scripts:

        lines.append("## NPM scripts")
        lines.append("")

        lines.append(
            "| Script | Command |"
        )
        lines.append(
            "|---|---|"
        )

        for name, command in sorted(
            scripts.items()
        ):

            lines.append(
                f"| `{name}` | `{command}` |"
            )

        lines.append("")

    dependencies = package_data.get(
        "dependencies",
        {},
    )

    dev_dependencies = package_data.get(
        "devDependencies",
        {},
    )

    if dependencies:

        lines.append("## Dependencies")
        lines.append("")

        lines.append(
            "| Package | Version |"
        )
        lines.append(
            "|---|---|"
        )

        for name, version in sorted(
            dependencies.items()
        ):

            lines.append(
                f"| `{name}` | `{version}` |"
            )

        lines.append("")

    if dev_dependencies:

        lines.append(
            "## Development dependencies"
        )
        lines.append("")

        lines.append(
            "| Package | Version |"
        )
        lines.append(
            "|---|---|"
        )

        for name, version in sorted(
            dev_dependencies.items()
        ):

            lines.append(
                f"| `{name}` | `{version}` |"
            )

        lines.append("")

    return lines


# ============================================================
# AUTOMATIC PROJECT SUMMARY
# ============================================================

def render_project_summary(
    project: Path,
    text_files: list[Path],
    binary_files: list[Path],
    empty_dirs: list[Path],
) -> list[str]:

    lines: list[str] = []

    all_files = (
        text_files
        + binary_files
    )

    classifications = Counter(
        classify_file(path)
        for path in all_files
    )

    lines.append("# 2. Automatic Project Summary")
    lines.append("")

    lines.append(
        f"- **Text/source/config files:** {len(text_files)}"
    )

    lines.append(
        f"- **Binary/media/asset files:** {len(binary_files)}"
    )

    lines.append(
        f"- **Total inventoried files:** {len(all_files)}"
    )

    lines.append(
        f"- **Empty directories:** {len(empty_dirs)}"
    )

    lines.append("")

    lines.append(
        "## File classification summary"
    )

    lines.append("")

    lines.append(
        "| Classification | Count |"
    )

    lines.append(
        "|---|---:|"
    )

    for name, count in sorted(
        classifications.items()
    ):

        lines.append(
            f"| `{name}` | {count} |"
        )

    lines.append("")

    # Important architecture areas
    important_areas = [
        ("App Router", project / "app"),
        ("Components", project / "components"),
        ("Services", project / "services"),
        ("Models", project / "models"),
        ("Hooks", project / "hooks"),
        ("Stores", project / "store"),
        ("Providers", project / "providers"),
        ("Types", project / "types"),
        ("Library utilities", project / "lib"),
        ("Configuration", project / "config"),
        ("Public assets", project / "public"),
    ]

    lines.append(
        "## Major architecture areas"
    )

    lines.append("")

    lines.append(
        "| Area | Exists |"
    )

    lines.append(
        "|---|---|"
    )

    for name, path in important_areas:

        exists = (
            "YES"
            if path.exists()
            else "NO"
        )

        lines.append(
            f"| {name} | `{exists}` |"
        )

    lines.append("")

    return lines


# ============================================================
# AUTOMATIC API SUMMARY
# ============================================================

def render_api_summary(
    project: Path,
    text_files: list[Path],
) -> list[str]:

    lines: list[str] = []

    api_routes = []

    for path in text_files:

        if "/app/api/" not in str(
            path
        ).replace("\\", "/").lower():

            continue

        if path.name not in {
            "route.ts",
            "route.tsx",
            "route.js",
            "route.jsx",
        }:

            continue

        content = read_text_safely(
            path
        )

        if content is None:
            continue

        endpoint = api_route_path(
            project,
            path,
        )

        methods = extract_api_methods(
            content
        )

        api_routes.append(
            (
                endpoint or "UNKNOWN",
                methods,
                relative_path(
                    project,
                    path,
                ),
            )
        )

    lines.append("# 9. API Route Intelligence")
    lines.append("")

    if not api_routes:

        lines.append(
            "No Next.js App Router API route handlers were detected."
        )
        lines.append("")

        return lines

    lines.append(
        "| Endpoint | Methods | Source |"
    )

    lines.append(
        "|---|---|---|"
    )

    for endpoint, methods, source in sorted(
        api_routes,
        key=lambda item: item[0],
    ):

        method_text = (
            ", ".join(
                f"`{method}`"
                for method in methods
            )
            if methods
            else "`NOT_DETECTED`"
        )

        lines.append(
            f"| `{endpoint}` | "
            f"{method_text} | "
            f"`{source}` |"
        )

    lines.append("")

    return lines


# ============================================================
# ENVIRONMENT SUMMARY
# ============================================================

def render_environment_summary(
    project: Path,
    text_files: list[Path],
) -> list[str]:

    lines: list[str] = []

    env_names: set[str] = set()

    for path in text_files:

        # Never inspect actual secret files.
        if is_secret_file(path):
            continue

        content = read_text_safely(
            path
        )

        if content is None:
            continue

        env_names.update(
            extract_env_names(content)
        )

    # Also inspect safe env templates.
    for env_name in SAFE_ENV_FILES:

        env_path = project / env_name

        if not env_path.exists():
            continue

        content = read_text_safely(
            env_path
        )

        if content is None:
            continue

        env_names.update(
            extract_env_names(content)
        )

    lines.append(
        "# 10. Environment Variable Intelligence"
    )

    lines.append("")

    lines.append(
        "Actual environment values are NEVER included."
    )

    lines.append("")

    if not env_names:

        lines.append(
            "No `process.env.*` references were detected."
        )

        lines.append("")

        return lines

    lines.append(
        "The following environment variable names "
        "are referenced by the codebase:"
    )

    lines.append("")

    for name in sorted(env_names):

        lines.append(
            f"- `{name}`"
        )

    lines.append("")

    return lines


# ============================================================
# ARCHITECTURE MAP
# ============================================================

def render_architecture_map(
    project: Path,
) -> list[str]:

    lines: list[str] = []

    lines.append("# 11. Architecture Map")
    lines.append("")

    lines.append(
        "The following is an **automatically generated "
        "structural map**, not a claim that every layer is "
        "fully implemented."
    )

    lines.append("")

    lines.append("```text")
    lines.append(
        "BuzzieWorld"
    )
    lines.append(
        "│"
    )
    lines.append(
        "├── app/                    → Next.js App Router"
    )
    lines.append(
        "│   ├── (public)/           → Public storefront"
    )
    lines.append(
        "│   ├── (customer)/         → Customer/account UI"
    )
    lines.append(
        "│   ├── (admin)/            → Admin UI"
    )
    lines.append(
        "│   ├── (auth)/             → Authentication UI"
    )
    lines.append(
        "│   └── api/                → Route handlers"
    )
    lines.append(
        "│"
    )
    lines.append(
        "├── components/             → UI components"
    )
    lines.append(
        "├── services/               → Application/service layer"
    )
    lines.append(
        "├── models/                 → Mongoose models"
    )
    lines.append(
        "├── hooks/                  → React/custom hooks"
    )
    lines.append(
        "├── store/                  → Client state stores"
    )
    lines.append(
        "├── providers/              → React providers"
    )
    lines.append(
        "├── types/                  → TypeScript types"
    )
    lines.append(
        "├── lib/                    → Shared utilities/infrastructure"
    )
    lines.append(
        "├── config/                 → Application configuration"
    )
    lines.append(
        "├── scripts/                → Development scripts"
    )
    lines.append(
        "└── public/                 → Static assets"
    )
    lines.append(
        "```"
    )

    lines.append("")

    return lines


# ============================================================
# SAFETY SECTION
# ============================================================

def render_safety_section() -> list[str]:

    return [
        "# 1. Blueprint Safety / Generation Information",
        "",
        "This blueprint was generated by a read-only scanner.",
        "",
        "The scanner does NOT:",
        "",
        "- modify project files",
        "- delete files",
        "- rename files",
        "- move files",
        "- execute project code",
        "- run npm commands",
        "- run Next.js",
        "- run Git commands",
        "- install packages",
        "- change environment variables",
        "- modify configuration",
        "",
        "Actual `.env` secret files are excluded.",
        "Environment variable VALUES are never included.",
        "Only environment variable NAMES may be reported.",
        "",
    ]


# ============================================================
# SOURCE CONTENT SECTION
# ============================================================

def render_source_contents(
    project: Path,
    text_files: list[Path],
) -> list[str]:

    lines: list[str] = []

    lines.append(
        "# 12. Complete Source / Configuration Contents"
    )

    lines.append("")

    lines.append(
        "The following sections contain the actual readable "
        "source/configuration contents found in the project."
    )

    lines.append("")

    lines.append(
        f"Maximum embedded file size: "
        f"`{format_size(MAX_CONTENT_SIZE_BYTES)}`"
    )

    lines.append("")

    if len(text_files) > MAX_SOURCE_FILES_WITH_CONTENT:

        lines.append(
            f"> The project contains {len(text_files)} readable "
            f"text/source files. The scanner will embed metadata "
            f"for all files but limit full source embedding to "
            f"{MAX_SOURCE_FILES_WITH_CONTENT} files."
        )

        lines.append("")

    source_files = text_files[
        :MAX_SOURCE_FILES_WITH_CONTENT
    ]

    for index, path in enumerate(
        source_files,
        start=1,
    ):

        lines.extend(
            render_source_file(
                project,
                path,
                index,
            )
        )

    return lines


# ============================================================
# FINAL HANDOFF NOTES
# ============================================================

def render_handoff_notes() -> list[str]:

    return [
        "# 13. Blueprint Interpretation Rules",
        "",
        "This document is a snapshot of the physical project at "
        "the time it was generated.",
        "",
        "IMPORTANT:",
        "",
        "1. File existence does NOT prove feature completion.",
        "2. A service/model/route may exist while its UI is incomplete.",
        "3. Empty directories may represent planned architecture.",
        "4. TODO/placeholder markers are only hints.",
        "5. Automatically detected classifications are approximate.",
        "6. The actual source code is more authoritative than an "
        "older project blueprint.",
        "7. Secrets are intentionally excluded.",
        "8. Binary assets are inventoried but not embedded.",
        "",
        "For future development conversations:",
        "",
        "- Treat this blueprint as the current physical-codebase snapshot.",
        "- When source code and an older blueprint disagree, prefer the source code.",
        "- Do not redesign the architecture unnecessarily.",
        "- Inspect existing files before replacing them.",
        "- Preserve existing functionality unless there is a clear reason to change it.",
        "",
    ]


# ============================================================
# MAIN
# ============================================================

def main() -> None:

    print()
    print("=" * 72)
    print(" BUZZIEWORLD PROJECT BLUEPRINT GENERATOR")
    print("=" * 72)
    print()
    print("READ-ONLY MODE")
    print()
    print("This program will ONLY read the selected project.")
    print("It will NOT modify, delete, rename, move, or execute")
    print("anything inside your project.")
    print()

    # --------------------------------------------------------
    # Select project
    # --------------------------------------------------------

    while True:

        project_input = input(
            "Enter the FULL path to your project folder:\n> "
        ).strip()

        if not project_input:

            print(
                "❌ Project path cannot be empty."
            )

            continue

        project = Path(
            project_input
        ).expanduser().resolve()

        if not project.exists():

            print(
                f"❌ Path does not exist:\n{project}"
            )

            continue

        if not project.is_dir():

            print(
                f"❌ Path is not a directory:\n{project}"
            )

            continue

        break

    # --------------------------------------------------------
    # Default output location
    # --------------------------------------------------------
    #
    # IMPORTANT:
    # The blueprint is intentionally placed OUTSIDE the project
    # by default so the generated blueprint does not become part
    # of the project being scanned.
    # --------------------------------------------------------

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    default_output = (
        project.parent
        / f"Buzzieworld_Project_Blueprint_03_{timestamp}.md"
    )

    print()
    print(
        "Default output:"
    )
    print(
        default_output
    )

    output_input = input(
        "\nPress Enter to use this location, "
        "or enter a different output path:\n> "
    ).strip()

    if output_input:

        output_file = (
            Path(output_input)
            .expanduser()
            .resolve()
        )

    else:

        output_file = default_output.resolve()

    # --------------------------------------------------------
    # Safety check
    # --------------------------------------------------------

    try:

        output_file.relative_to(
            project
        )

        output_inside_project = True

    except ValueError:

        output_inside_project = False

    if output_inside_project:

        print()
        print(
            "⚠️ WARNING:"
        )
        print(
            "The output path is INSIDE the project being scanned."
        )
        print(
            "This is allowed, but it means the generated blueprint"
        )
        print(
            "will become a project file."
        )
        print()

        confirmation = input(
            "Type YES to continue, or anything else to cancel:\n> "
        ).strip()

        if confirmation != "YES":

            print()
            print(
                "❌ Cancelled. No project files were changed."
            )

            return

    # --------------------------------------------------------
    # Scan
    # --------------------------------------------------------

    print()
    print(
        "Scanning project..."
    )
    print(
        "This is read-only and may take a little while for larger projects."
    )
    print()

    started_at = datetime.now()

    text_files, binary_files, empty_dirs = collect_files(
        project
    )

    finished_at = datetime.now()

    duration = (
        finished_at - started_at
    ).total_seconds()

    print(
        f"Readable/source/config files: {len(text_files)}"
    )

    print(
        f"Binary/media/asset files: {len(binary_files)}"
    )

    print(
        f"Empty directories: {len(empty_dirs)}"
    )

    print(
        f"Scan time: {duration:.2f} seconds"
    )

    # --------------------------------------------------------
    # Build blueprint
    # --------------------------------------------------------

    blueprint: list[str] = []

    blueprint.append(
        "# BUZZIEWORLD PROJECT BLUEPRINT 03"
    )

    blueprint.append("")

    blueprint.append(
        "> Automatically generated read-only project snapshot."
    )

    blueprint.append("")

    blueprint.append(
        f"**Generated:** "
        f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    blueprint.append("")

    blueprint.append(
        f"**Project root:** `{project}`"
    )

    blueprint.append("")

    blueprint.append(
        "**Purpose:** Current physical-codebase handoff/source-of-truth snapshot."
    )

    blueprint.append("")

    # --------------------------------------------------------
    # Project overview
    # --------------------------------------------------------

    blueprint.append(
        "# Project Overview"
    )

    blueprint.append("")

    blueprint.append(
        "This document describes the actual files and readable "
        "source code present at scan time."
    )

    blueprint.append("")

    blueprint.append(
        "The scanner intentionally excludes generated/dependency "
        "directories such as `node_modules`, `.next`, and `.git`."
    )

    blueprint.append("")

    # --------------------------------------------------------
    # Safety
    # --------------------------------------------------------

    blueprint.extend(
        render_safety_section()
    )

    # --------------------------------------------------------
    # Automatic summary
    # --------------------------------------------------------

    blueprint.extend(
        render_project_summary(
            project,
            text_files,
            binary_files,
            empty_dirs,
        )
    )

    # --------------------------------------------------------
    # Package intelligence
    # --------------------------------------------------------

    blueprint.extend(
        render_package_section(
            project
        )
    )

    # --------------------------------------------------------
    # Tree
    # --------------------------------------------------------

    blueprint.append(
        "# 3. Complete Project Tree"
    )

    blueprint.append("")

    blueprint.append(
        "```text"
    )

    tree_lines = build_tree_lines(
        project,
        lines=[],
    )

    blueprint.extend(
        tree_lines
    )

    blueprint.append(
        "```"
    )

    blueprint.append("")

    # --------------------------------------------------------
    # File inventory
    # --------------------------------------------------------

    blueprint.extend(
        render_file_inventory(
            project,
            text_files,
            binary_files,
        )
    )

    # --------------------------------------------------------
    # Assets
    # --------------------------------------------------------

    blueprint.extend(
        render_asset_inventory(
            project,
            binary_files,
        )
    )

    # --------------------------------------------------------
    # Empty directories
    # --------------------------------------------------------

    blueprint.extend(
        render_empty_directories(
            project,
            empty_dirs,
        )
    )

    # --------------------------------------------------------
    # API intelligence
    # --------------------------------------------------------

    blueprint.extend(
        render_api_summary(
            project,
            text_files,
        )
    )

    # --------------------------------------------------------
    # Environment intelligence
    # --------------------------------------------------------

    blueprint.extend(
        render_environment_summary(
            project,
            text_files,
        )
    )

    # --------------------------------------------------------
    # Architecture map
    # --------------------------------------------------------

    blueprint.extend(
        render_architecture_map(
            project
        )
    )

    # --------------------------------------------------------
    # Source contents
    # --------------------------------------------------------

    blueprint.extend(
        render_source_contents(
            project,
            text_files,
        )
    )

    # --------------------------------------------------------
    # Interpretation / handoff notes
    # --------------------------------------------------------

    blueprint.extend(
        render_handoff_notes()
    )

    # --------------------------------------------------------
    # Write ONLY the blueprint
    # --------------------------------------------------------

    output_file.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with output_file.open(
        "w",
        encoding="utf-8",
    ) as file:

        file.write(
            "\n".join(blueprint)
        )

        file.write("\n")

    # --------------------------------------------------------
    # Final confirmation
    # --------------------------------------------------------

    print()
    print("=" * 72)
    print(" ✅ BLUEPRINT GENERATED")
    print("=" * 72)
    print()
    print(
        f"Output:\n{output_file}"
    )
    print()
    print(
        f"Blueprint lines: {len(blueprint):,}"
    )
    print(
        f"Source/config files scanned: {len(text_files):,}"
    )
    print(
        f"Assets inventoried: {len(binary_files):,}"
    )
    print(
        f"Empty directories: {len(empty_dirs):,}"
    )
    print()
    print(
        "Your actual project was NOT modified."
    )
    print()
    print(
        "Upload the generated .md file to ChatGPT for analysis."
    )
    print()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()
