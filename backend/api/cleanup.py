from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def cleanup_files():
    # TODO: Phase 1 mein cleanup logic aayegi yahan
    return {"message": "Cleanup not yet implemented", "deleted": []}
