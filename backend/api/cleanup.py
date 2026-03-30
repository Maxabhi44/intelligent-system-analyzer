from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.cleanup import move_to_trash, undo_trash, get_trash_items, empty_trash

router = APIRouter()


class TrashRequest(BaseModel):
    file_path: str


class UndoRequest(BaseModel):
    trash_id: str


@router.post("/trash")
async def trash_file(request: TrashRequest):
    """File ko ISA Trash mein move karo."""
    result = move_to_trash(request.file_path)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/undo")
async def undo(request: UndoRequest):
    """File ko trash se wapas lao."""
    result = undo_trash(request.trash_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/trash")
async def list_trash():
    """Trash mein kya kya hai dikhao."""
    return {"items": get_trash_items()}


@router.delete("/trash/empty")
async def delete_permanently():
    """Trash permanently empty karo — UNDO NAHI HOGA!"""
    return empty_trash()


@router.get("/")
async def cleanup_status():
    return {"message": "Cleanup API ready"}
