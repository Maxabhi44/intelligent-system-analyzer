from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.scanner import scan_directory
from services.insight_gen import generate_summary, get_large_files, get_junk_files

router = APIRouter()


class InsightRequest(BaseModel):
    path: str
    min_large_size_mb: float = 100.0
    unused_days: int = 90


@router.post("/summary")
async def get_summary(request: InsightRequest):
    """Ek path scan karo aur poora insight summary do."""
    result = scan_directory(request.path)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    summary = generate_summary(result["files"])
    summary["scan_id"] = result["scan_id"]
    summary["scanned_at"] = result["scanned_at"]
    return summary


@router.post("/large-files")
async def get_large(request: InsightRequest):
    """Sirf large files dikhao."""
    result = scan_directory(request.path)
    large = get_large_files(result["files"], request.min_large_size_mb)
    return {"count": len(large), "files": large}


@router.post("/junk-files")
async def get_junk(request: InsightRequest):
    """Sirf junk files dikhao."""
    result = scan_directory(request.path)
    junk = get_junk_files(result["files"])
    return {"count": len(junk), "files": junk}


@router.get("/")
async def get_insights():
    return {"message": "POST /insights/summary mein path do"}
