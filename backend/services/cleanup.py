import os
import shutil
import uuid
import json
from pathlib import Path
from datetime import datetime

# ISA ka apna Trash folder — system recycle bin nahi
TRASH_DIR = Path.home() / ".isa_trash"
TRASH_LOG = TRASH_DIR / "trash_log.json"


def _ensure_trash():
    """Trash folder exist karo — nahi hai toh banao."""
    TRASH_DIR.mkdir(exist_ok=True)


def _load_log() -> list:
    """Trash log padho — kya kya trash mein hai."""
    if not TRASH_LOG.exists():
        return []
    try:
        with open(TRASH_LOG, "r") as f:
            return json.load(f)
    except Exception:
        return []


def _save_log(log: list):
    """Trash log save karo."""
    with open(TRASH_LOG, "w") as f:
        json.dump(log, f, indent=2)


def move_to_trash(file_path: str) -> dict:
    """
    File ko ISA Trash mein move karo.
    Original path save karo taaki undo ho sake.
    """
    _ensure_trash()
    source = Path(file_path)

    if not source.exists():
        return {"success": False, "error": f"File nahi mili: {file_path}"}

    # Unique naam do taaki same naam ki files clash na karein
    trash_id = str(uuid.uuid4())[:8]
    trash_name = f"{trash_id}_{source.name}"
    dest = TRASH_DIR / trash_name

    try:
        shutil.move(str(source), str(dest))

        # Log mein save karo
        log = _load_log()
        log.append(
            {
                "trash_id": trash_id,
                "original_path": str(source),
                "trash_path": str(dest),
                "deleted_at": datetime.now().isoformat(),
                "size_mb": round(dest.stat().st_size / (1024 * 1024), 2),
            }
        )
        _save_log(log)

        return {
            "success": True,
            "trash_id": trash_id,
            "original_path": str(source),
            "message": f"File trash mein gayi — undo kar sakte ho",
        }

    except PermissionError:
        return {
            "success": False,
            "error": "Permission denied — yeh file delete nahi ho sakti",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def undo_trash(trash_id: str) -> dict:
    """
    File ko trash se wapas original jagah bhejo.
    """
    log = _load_log()
    entry = next((e for e in log if e["trash_id"] == trash_id), None)

    if not entry:
        return {"success": False, "error": f"Trash ID nahi mila: {trash_id}"}

    source = Path(entry["trash_path"])
    dest = Path(entry["original_path"])

    if not source.exists():
        return {"success": False, "error": "Trash file already delete ho gayi"}

    try:
        # Original folder exist karo
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), str(dest))

        # Log se remove karo
        log = [e for e in log if e["trash_id"] != trash_id]
        _save_log(log)

        return {
            "success": True,
            "restored_to": str(dest),
            "message": "File wapas aa gayi!",
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def get_trash_items() -> list:
    """Trash mein kya kya hai — dikhao."""
    return _load_log()


def empty_trash() -> dict:
    """
    Trash permanently delete karo — UNDO NAHI HOGA!
    """
    _ensure_trash()
    log = _load_log()
    deleted = 0
    errors = []

    for entry in log:
        try:
            p = Path(entry["trash_path"])
            if p.exists():
                p.unlink()
                deleted += 1
        except Exception as e:
            errors.append(str(e))

    _save_log([])  # Log clear karo

    return {
        "success": True,
        "permanently_deleted": deleted,
        "errors": errors,
        "message": f"{deleted} files permanently delete ho gayi",
    }
