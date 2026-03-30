import os
import uuid
from datetime import datetime
from pathlib import Path

# Yeh folders kabhi scan nahi honge — system ke important folders hain
SKIP_FOLDERS = {
    "Windows", "System32", "SysWOW64", "Program Files",
    "Program Files (x86)", "$Recycle.Bin", "AppData\\Local\\Temp",
}


def should_skip(path: str) -> bool:
    """Check karo — kya yeh folder skip karna chahiye?"""
    for skip in SKIP_FOLDERS:
        if skip.lower() in path.lower():
            return True
    return False


def scan_directory(root_path: str, max_depth: int = 5) -> dict:
    """
    Ek folder ko scan karo aur saari files ki info nikalo.

    Args:
        root_path: Kaunsa folder scan karna hai (e.g. C:/Users/maxab/Downloads)
        max_depth: Kitne andar tak jaana hai folders mein

    Returns:
        scan_result: scan_id, files list, total size, errors
    """
    scan_id = str(uuid.uuid4())  # Har scan ka unique ID
    files = []
    errors = []
    total_size = 0

    root = Path(root_path)

    # Check karo folder exist karta hai?
    if not root.exists():
        return {
            "scan_id": scan_id,
            "error": f"Folder nahi mila: {root_path}",
            "files": [],
        }

    def _scan(current_path: Path, current_depth: int):
        nonlocal total_size

        # Depth limit check
        if current_depth > max_depth:
            return

        try:
            for entry in os.scandir(current_path):
                # System folders skip karo
                if should_skip(entry.path):
                    continue

                if entry.is_file(follow_symlinks=False):
                    try:
                        stat = entry.stat()
                        file_info = {
                            "name": entry.name,
                            "path": entry.path,
                            "size_bytes": stat.st_size,
                            "size_mb": round(stat.st_size / (1024 * 1024), 2),
                            "last_modified": datetime.fromtimestamp(
                                stat.st_mtime
                            ).isoformat(),
                            "last_accessed": datetime.fromtimestamp(
                                stat.st_atime
                            ).isoformat(),
                            "extension": Path(entry.name).suffix.lower(),
                        }
                        files.append(file_info)
                        total_size += stat.st_size

                    except PermissionError:
                        errors.append(f"Permission denied: {entry.path}")
                    except Exception as e:
                        errors.append(f"Error reading {entry.path}: {str(e)}")

                elif entry.is_dir(follow_symlinks=False):
                    # Andar jaao recursively
                    _scan(Path(entry.path), current_depth + 1)

        except PermissionError:
            errors.append(f"Permission denied: {current_path}")
        except Exception as e:
            errors.append(f"Error scanning {current_path}: {str(e)}")

    # Scan shuru karo
    _scan(root, 0)

    return {
        "scan_id": scan_id,
        "root_path": root_path,
        "scanned_at": datetime.now().isoformat(),
        "total_files": len(files),
        "total_size_mb": round(total_size / (1024 * 1024), 2),
        "files": files,
        "errors": errors,
    }
