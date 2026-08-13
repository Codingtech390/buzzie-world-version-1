#!/usr/bin/env python3
"""
Project Structure Blueprint Generator
Creates a clean folder + file tree of a Next.js / React / any project,
excluding node_modules, .next, .git, etc.
"""

import os
from pathlib import Path
from datetime import datetime

# ============================================================
# FOLDERS & FILES TO SKIP (you can add more if needed)
# ============================================================
SKIP_DIRS = {
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
    ".vscode",
    ".idea",
    "__pycache__",
    ".pytest_cache",
    "venv",
    "env",
    ".env",
    "tmp",
    "temp",
    "logs",
    ".DS_Store",
}

SKIP_FILES = {
    ".DS_Store",
    "Thumbs.db",
    ".gitignore",          # optional – remove if you want to see it
    "package-lock.json",   # optional – remove if you want it
    "yarn.lock",
    "pnpm-lock.yaml",
}

# ============================================================
# Tree printer
# ============================================================
def should_skip(path: Path) -> bool:
    name = path.name
    if path.is_dir() and name in SKIP_DIRS:
        return True
    if path.is_file() and name in SKIP_FILES:
        return True
    # also skip hidden files/folders except important ones
    if name.startswith(".") and name not in {".env.example", ".env.local.example"}:
        return True
    return False


def scan(path: Path, prefix: str = "", is_last: bool = True, lines: list = None):
    if lines is None:
        lines = []

    connector = "└── " if is_last else "├── "
    lines.append(f"{prefix}{connector}{path.name}")

    if path.is_dir():
        try:
            children = sorted(
                [p for p in path.iterdir() if not should_skip(p)],
                key=lambda x: (x.is_file(), x.name.lower())
            )
        except PermissionError:
            lines.append(f"{prefix}    [ACCESS DENIED]")
            return lines

        for i, child in enumerate(children):
            is_last_child = (i == len(children) - 1)
            new_prefix = prefix + ("    " if is_last else "│   ")
            scan(child, new_prefix, is_last_child, lines)

    return lines


# ============================================================
# Main
# ============================================================
def main():
    print("\n" + "=" * 60)
    print("  Project Structure Blueprint Generator")
    print("  (Next.js / React / any JS project friendly)")
    print("=" * 60)

    # ----- Input: Project path -----
    while True:
        project_path = input("\nEnter path to the project folder to scan:\n> ").strip()
        if not project_path:
            print("Path cannot be empty.")
            continue
        project = Path(project_path).expanduser().resolve()
        if not project.exists():
            print(f"❌ Path does not exist: {project}")
            continue
        if not project.is_dir():
            print(f"❌ Not a directory: {project}")
            continue
        break

    # ----- Input: Output file path -----
    default_output = f"project_structure_updated_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    output_path = input(f"\nEnter path for the output text file\n(or press Enter for default: {default_output}):\n> ").strip()

    if not output_path:
        output_path = default_output

    output_file = Path(output_path).expanduser().resolve()

    # Make sure parent folder exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print("\nScanning... (this may take a few seconds)")

    # ----- Generate tree -----
    tree_lines = [str(project)]
    tree_lines = scan(project, lines=tree_lines)

    # ----- Write report -----
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# Project Structure Blueprint\n")
        f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"# Root: {project}\n")
        f.write("# Excluded: node_modules, .next, .git, dist, build, coverage, etc.\n\n")
        f.write("\n".join(tree_lines))
        f.write("\n")

    print(f"\n✅ Done!")
    print(f"Structure saved to: {output_file}")
    print(f"Total lines: {len(tree_lines)}")
    print("\nYou can now upload this .txt file to ChatGPT / Grok.")


if __name__ == "__main__":
    main()
