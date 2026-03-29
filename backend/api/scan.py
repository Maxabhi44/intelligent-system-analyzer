from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.scanner import scan_directory

router = APIRouter()


class ScanRequest(BaseModel):
    path: str
    max_depth: int = 5


@router.get("/")
async def get_scan_status():
    return {"status": "Scanner ready", "phase": "MVP"}


@router.post("/start")
async def start_scan(request: ScanRequest):
    """
    Scan shuru karo — path do, result milega.
    Example: {"path": "C:/Users/maxab/Downloads"}
    """
    if not request.path:
        raise HTTPException(status_code=400, detail="Path dena zaroori hai!")

    result = scan_directory(request.path, request.max_depth)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return result
