from pathlib import Path
from datetime import datetime, timezone

# Yeh extensions = junk files hoti hain mostly
JUNK_EXTENSIONS = {
    ".tmp",
    ".temp",
    ".log",
    ".cache",
    ".bak",
    ".old",
    ".dmp",
    ".chk",
    ".thumbs",
    ".ds_store",
}

# Yeh folders mein milne wali files = junk
JUNK_FOLDERS = {
    "temp",
    "tmp",
    "cache",
    "recycle",
    "trash",
    ".cache",
    "__pycache__",
    "node_modules/.cache",
}

# Yeh files kabhi junk nahi — chahe kahan bhi hon
SAFE_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".doc",
    ".xlsx",
    ".xls",
    ".jpg",
    ".jpeg",
    ".png",
    ".mp4",
    ".mp3",
    ".zip",
    ".rar",
}

# Risky executables / scripts
RISKY_EXTENSIONS = {
    ".exe",
    ".bat",
    ".vbs",
    ".ps1",
    ".scr",
}


def get_large_files(files: list, min_size_mb: float = 100.0) -> list:
    """
    Sabse badi files dhundho.
    Default: 100MB se badi files dikhao.
    """
    large = [f for f in files if f["size_mb"] >= min_size_mb]
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

        is_safe_file = ext in SAFE_EXTENSIONS
        if (is_junk_ext or is_junk_folder) and not is_safe_file:
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


def get_risky_files(files: list) -> list:
    """
    Risky files dhundho — executables, scripts etc.
    """
    risky = []
    for f in files:
        ext = f.get("extension", "").lower()
        if ext in RISKY_EXTENSIONS:
            risky.append(
                {
                    **f,
                    "reason": f"Executable/script file: {ext} — verify before keeping",
                }
            )
    risky.sort(key=lambda x: x["size_mb"], reverse=True)
    return risky


def calculate_file_intelligence_score(file: dict) -> dict:
    """
    8 parameters se file ka intelligence score calculate karo.
    Score 0-100: jitna zyada, utna zyada junk/delete safe.
    """
    score = 0
    reasons = []

    ext = file.get("extension", "").lower()
    path_lower = file.get("path", "").lower()
    name_lower = file.get("name", "").lower()
    size_mb = file.get("size_mb", 0)

    # --- 1. EXTENSION (20 points) ---
    HIGH_JUNK_EXT = {".tmp", ".temp", ".log", ".cache", ".bak", ".old", ".dmp", ".chk"}
    SAFE_EXT = {
        ".pdf",
        ".docx",
        ".doc",
        ".xlsx",
        ".jpg",
        ".jpeg",
        ".png",
        ".mp4",
        ".mp3",
    }
    if ext in HIGH_JUNK_EXT:
        score += 20
        reasons.append(f"Junk file type ({ext})")
    elif ext in SAFE_EXT:
        score += 0
        reasons.append(f"Important file type ({ext})")
    else:
        score += 10

    # --- 2. LOCATION (25 points) ---
    HIGH_JUNK_FOLDERS = {
        "__pycache__",
        "node_modules",
        ".cache",
        "temp",
        "tmp",
        "recycle",
    }
    SAFE_FOLDERS = {"documents", "pictures", "music", "videos", "desktop"}
    if any(j in path_lower for j in HIGH_JUNK_FOLDERS):
        score += 25
        reasons.append("Found in junk/cache folder")
    elif any(s in path_lower for s in SAFE_FOLDERS):
        score += 0
        reasons.append("Found in important folder")
    else:
        score += 10

    # --- 3. LAST ACCESSED (20 points) ---
    try:
        now = datetime.now(timezone.utc)
        last = datetime.fromisoformat(file.get("last_accessed", ""))
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        days = (now - last).days
        if days >= 365:
            score += 20
            reasons.append(f"Not accessed in {days} days")
        elif days >= 90:
            score += 12
            reasons.append(f"Not accessed in {days} days")
        elif days >= 30:
            score += 5
        else:
            score += 0
            reasons.append("Recently accessed")
    except:
        score += 10

    # --- 4. MODIFICATION DATE (15 points) ---
    try:
        now = datetime.now(timezone.utc)
        modified = datetime.fromisoformat(file.get("last_modified", ""))
        if modified.tzinfo is None:
            modified = modified.replace(tzinfo=timezone.utc)
        mod_days = (now - modified).days
        if mod_days >= 365:
            score += 15
            reasons.append(f"Not modified in {mod_days} days")
        elif mod_days >= 180:
            score += 8
        else:
            score += 0
    except:
        score += 5

    # --- 5. SIZE (10 points) ---
    if size_mb == 0:
        score += 10
        reasons.append("Empty file (0 MB)")
    elif size_mb < 0.01:
        score += 8
        reasons.append("Very small file")
    elif size_mb > 500:
        score += 3
        reasons.append(f"Large file ({size_mb} MB)")
    else:
        score += 0

    # --- 6. NAME PATTERN (10 points) ---
    IMPORTANT_PATTERNS = [
        "assignment",
        "project",
        "resume",
        "cv",
        "report",
        "invoice",
        "certificate",
        "photo",
        "backup",
        "important",
    ]
    JUNK_PATTERNS = [
        "temp",
        "tmp",
        "cache",
        "log",
        "debug",
        "test",
        "untitled",
        "copy",
        "old",
        "bak",
    ]
    if any(p in name_lower for p in IMPORTANT_PATTERNS):
        score -= 10
        reasons.append("Important name pattern detected")
    elif any(p in name_lower for p in JUNK_PATTERNS):
        score += 10
        reasons.append("Junk name pattern detected")

    score = max(0, min(100, score))

    if score >= 70:
        category = "Delete Safe"
        color = "green"
    elif score >= 40:
        category = "Review Recommended"
        color = "yellow"
    else:
        category = "Keep — Do Not Delete"
        color = "red"

    return {
        **file,
        "intelligence_score": score,
        "delete_category": category,
        "score_color": color,
        "score_reasons": reasons,
    }


def get_performance_score(junk: list, junk_size_mb: float) -> dict:
    """
    Performance score — junk files se calculate karo.
    Jitna zyada junk, utna kam performance.
    """
    score = 100

    # Junk file count
    if len(junk) > 200:
        score -= 30
    elif len(junk) > 100:
        score -= 20
    elif len(junk) > 50:
        score -= 10
    elif len(junk) > 0:
        score -= 5

    # Junk size
    if junk_size_mb > 1024:
        score -= 20
    elif junk_size_mb > 512:
        score -= 10
    elif junk_size_mb > 100:
        score -= 5

    score = max(0, min(100, score))

    if score >= 80:
        status = "Optimal"
        tip = None
    elif score >= 60:
        status = "Needs Attention"
        tip = "🧹 Junk cleanup recommended"
    else:
        status = "Poor"
        tip = "🧹 Clean junk files to improve performance"

    return {
        "score": score,
        "status": status,
        "tip": tip,
    }


def get_storage_score(
    junk_size_mb: float, total_size_mb: float, large_size_mb: float
) -> dict:
    """
    Storage score — junk % aur large files se calculate karo.
    """
    score = 100

    # Junk % of total
    if total_size_mb > 0:
        junk_percent = (junk_size_mb / total_size_mb) * 100
    else:
        junk_percent = 0

    if junk_percent > 10:
        score -= 25
    elif junk_percent > 5:
        score -= 15
    elif junk_percent > 1:
        score -= 5

    # Large files GB
    large_size_gb = large_size_mb / 1024
    if large_size_gb > 20:
        score -= 35
    elif large_size_gb > 10:
        score -= 20
    elif large_size_gb > 5:
        score -= 10

    score = max(0, min(100, score))

    if score >= 80:
        status = "Healthy"
        tip = None
    elif score >= 60:
        status = "Needs Attention"
        tip = "⚠️ Storage needs attention"
    else:
        status = "Low"
        tip = "⚠️ Review large files to free up space"

    return {
        "score": score,
        "status": status,
        "tip": tip,
    }


def get_security_score(risky: list) -> dict:
    """
    Security score — risky files se calculate karo.
    """
    score = 100

    if len(risky) > 100:
        score -= 40
    elif len(risky) > 50:
        score -= 30
    elif len(risky) > 10:
        score -= 10
    elif len(risky) > 0:
        score -= 5

    score = max(0, min(100, score))

    if score >= 80:
        status = "Secure"
        tip = None
    elif score >= 60:
        status = "At Risk"
        tip = "🔒 Review executable files"
    else:
        status = "Danger"
        tip = "🔒 Security needs immediate attention"

    return {
        "score": score,
        "status": status,
        "tip": tip,
    }


def get_status_lines(performance: dict, storage: dict, security: dict) -> list:
    """
    Overall health score ki jagah — status lines dikhao.
    """
    lines = []

    if performance.get("tip"):
        lines.append(performance["tip"])
    if storage.get("tip"):
        lines.append(storage["tip"])
    if security.get("tip"):
        lines.append(security["tip"])

    if not lines:
        lines.append("✅ System looks good!")

    return lines


def generate_summary(files: list) -> dict:
    """
    Poore scan ka summary banao — dashboard ke liye.
    """
    scored_files = [calculate_file_intelligence_score(f) for f in files]
    large = get_large_files(scored_files)
    junk = get_junk_files(scored_files)
    unused = get_unused_files(scored_files)
    risky = get_risky_files(scored_files)

    total_size = sum(f["size_mb"] for f in files)
    junk_size = sum(f["size_mb"] for f in junk)
    large_size = sum(f["size_mb"] for f in large)

    # 3 alag scores
    performance = get_performance_score(junk, junk_size)
    storage = get_storage_score(junk_size, total_size, large_size)
    security = get_security_score(risky)

    # Status lines
    status_lines = get_status_lines(performance, storage, security)

    return {
        "total_files": len(scored_files),
        "total_size_mb": round(total_size, 2),
        "large_files": {
            "count": len(large),
            "size_mb": round(large_size, 2),
            "files": large[:10],
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
        "risky_files": {
            "count": len(risky),
            "files": risky[:10],
        },
        "potential_savings_mb": round(junk_size + large_size, 2),
        "scores": {
            "performance": performance,
            "storage": storage,
            "security": security,
        },
        "status_lines": status_lines,
    }


def _junk_reason(ext: str, path: str) -> str:
    """Junk hone ki wajah batao."""
    if ext in JUNK_EXTENSIONS:
        return f"Junk file type: {ext}"
    if any(j in path for j in JUNK_FOLDERS):
        return "Found in temp/cache folder"
    return "Unknown junk"
