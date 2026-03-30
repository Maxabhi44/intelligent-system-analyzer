from pathlib import Path
from datetime import datetime, timezone

# Yeh extensions = junk files hoti hain mostly
JUNK_EXTENSIONS = {
    ".tmp", ".temp", ".log", ".cache", ".bak",
    ".old", ".dmp", ".chk", ".thumbs", ".ds_store",
}

# Yeh folders mein milne wali files = junk
JUNK_FOLDERS = {
    "temp", "tmp", "cache", "recycle", "trash"
}


def get_large_files(files: list, min_size_mb: float = 100.0) -> list:
    """
    Sabse badi files dhundho.
    Default: 100MB se badi files dikhao.
    """
    large = [f for f in files if f["size_mb"] >= min_size_mb]
    # Size ke hisaab se sort karo — sabse badi pehle
    large.sort(key=lambda x: x["size_mb"], reverse=True)
    return large


def get_junk_files(files: list) -> list:
    """
    Junk files dhundho — temp, cache, log, bak etc.
    """
    junk = []
    for f in files:
        ext = f.get("extension", "").lower()
        path_lower = f.get("path", "").lower()

        is_junk_ext = ext in JUNK_EXTENSIONS
        is_junk_folder = any(j in path_lower for j in JUNK_FOLDERS)

        if is_junk_ext or is_junk_folder:
            junk.append({**f, "reason": _junk_reason(ext, path_lower)})

    return junk


def get_unused_files(files: list, days: int = 90) -> list:
    """
    Un files ko dhundho jo kaafi time se open nahi ki gayi.
    Default: 90 din se zyaada purani.
    """
    now = datetime.now(timezone.utc)
    unused = []

    for f in files:
        try:
            last = datetime.fromisoformat(f["last_accessed"])
            if last.tzinfo is None:
                last = last.replace(tzinfo=timezone.utc)
            diff = (now - last).days
            if diff >= days:
                unused.append({**f, "unused_days": diff})
        except Exception:
            continue

    unused.sort(key=lambda x: x["unused_days"], reverse=True)
    return unused


def generate_summary(files: list) -> dict:
    """
    Poore scan ka summary banao — dashboard ke liye.
    """
    large = get_large_files(files)
    junk = get_junk_files(files)
    unused = get_unused_files(files)

    total_size = sum(f["size_mb"] for f in files)
    junk_size = sum(f["size_mb"] for f in junk)
    large_size = sum(f["size_mb"] for f in large)

    return {
        "total_files": len(files),
        "total_size_mb": round(total_size, 2),
        "large_files": {
            "count": len(large),
            "size_mb": round(large_size, 2),
            "files": large[:10],  # Top 10 dikhao
        },
        "junk_files": {
            "count": len(junk),
            "size_mb": round(junk_size, 2),
            "files": junk[:10],
        },
        "unused_files": {
            "count": len(unused),
            "files": unused[:10],
        },
        "potential_savings_mb": round(junk_size + large_size, 2),
    }


def _junk_reason(ext: str, path: str) -> str:
    """Junk hone ki wajah batao."""
    if ext in JUNK_EXTENSIONS:
        return f"Junk file type: {ext}"
    if any(j in path for j in JUNK_FOLDERS):
        return "Found in temp/cache folder"
    return "Unknown junk"
