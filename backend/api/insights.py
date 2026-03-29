from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_insights():
    # TODO: Phase 1 mein insights generate hongi yahan
    return {"insights": [], "message": "No scan run yet"}
