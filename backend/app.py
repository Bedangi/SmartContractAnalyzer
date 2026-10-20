from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.summarizer import router as summarizer_router
from routes.risk import router as risk_router
from routes.classification import router as classification_router
from routes.segmentation import router as segmentation_router

app = FastAPI(
    title="Smart Contract Analyzer API",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# --------------------------------------------------
# Routes
# --------------------------------------------------

app.include_router(
    summarizer_router
)

app.include_router(
    risk_router
)

app.include_router(classification_router)
app.include_router(segmentation_router)

# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "ok"
    }