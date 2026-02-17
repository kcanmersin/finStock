from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime
import json, os

app = FastAPI(title="finStock API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory store  (swap with a real DB when needed)
# ---------------------------------------------------------------------------
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

FUNDS: list[dict] = []
STOCKS: list[dict] = []
ANALYSES: list[dict] = []


def _load_json(name: str) -> list[dict]:
    path = os.path.join(DATA_DIR, name)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def _save_json(name: str, data: list[dict]):
    with open(os.path.join(DATA_DIR, name), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@app.on_event("startup")
def startup():
    global FUNDS, STOCKS, ANALYSES
    FUNDS = _load_json("funds.json")
    STOCKS = _load_json("stocks.json")
    ANALYSES = _load_json("analyses.json")


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Funds
# ---------------------------------------------------------------------------
@app.get("/api/funds")
def get_funds():
    return FUNDS


@app.post("/api/funds")
def create_fund(fund: dict):
    fund.setdefault("id", str(uuid4()))
    FUNDS.append(fund)
    _save_json("funds.json", FUNDS)
    return fund


# ---------------------------------------------------------------------------
# Stocks
# ---------------------------------------------------------------------------
@app.get("/api/stocks")
def get_stocks():
    return STOCKS


@app.post("/api/stocks")
def create_stock(stock: dict):
    stock.setdefault("id", str(uuid4()))
    STOCKS.append(stock)
    _save_json("stocks.json", STOCKS)
    return stock


# ---------------------------------------------------------------------------
# Analyses
# ---------------------------------------------------------------------------
@app.get("/api/analyses")
def get_analyses():
    return ANALYSES


@app.get("/api/analyses/{analysis_id}")
def get_analysis(analysis_id: str):
    for a in ANALYSES:
        if a["id"] == analysis_id:
            return a
    raise HTTPException(status_code=404, detail="Analiz bulunamadi")


@app.delete("/api/analyses/{analysis_id}")
def delete_analysis(analysis_id: str):
    global ANALYSES
    ANALYSES = [a for a in ANALYSES if a["id"] != analysis_id]
    _save_json("analyses.json", ANALYSES)
    return {"ok": True}


@app.post("/api/upload")
async def upload_analysis(
    file: UploadFile = File(...),
    title: str = Form(""),
    type: str = Form("fund"),
):
    content = await file.read()
    analysis = {
        "id": str(uuid4()),
        "title": title or file.filename,
        "createdAt": datetime.utcnow().isoformat(),
        "type": type,
        "summary": "Yuklenen dosyadan olusturuldu.",
        "recommendations": [],
        "rawData": [],
        "fileName": file.filename,
    }
    ANALYSES.append(analysis)
    _save_json("analyses.json", ANALYSES)
    return analysis
