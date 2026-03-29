from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_settings():
    return {
        "scan_root": "C:/Users",
        "skip_system_folders": True,
        "ai_enabled": False,
    }
