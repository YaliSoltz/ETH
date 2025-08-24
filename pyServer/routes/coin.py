from datetime import datetime

from fastapi import APIRouter, HTTPException
from pyServer.db import db
import httpx
from pyServer.models.eth import ETH
from pyServer.models.sol import SOL

from pyServer.models.currency import CurrencyData

router = APIRouter()

# Coin definitions
COINS = {
    "eth": {"symbol": "ETH", "collection": db.get_collection("eths"), "model": ETH},
    "sol": {"symbol": "SOL", "collection": db.get_collection("sols"), "model": SOL},
}

# Supported currencies
CURRENCIES = [
    ("USD", "$"),
    ("EUR", "€"),
    ("BTC", "₿"),
    ("ILS", "₪"),
]

CMC_API_KEY = "92644239-8cbd-47fa-b5d7-7b0ab1d60a9a"
CMC_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"


@router.get("/{coin}")
async def get_coin(coin: str):
    if coin not in COINS:
        raise HTTPException(status_code=404, detail="Coin not supported")

    coin_data = {}
    headers = {"X-CMC_PRO_API_KEY": CMC_API_KEY}

    async with httpx.AsyncClient() as client:
        for currency, symbol in CURRENCIES:
            try:
                r = await client.get(
                    CMC_URL,
                    params={"symbol": COINS[coin]["symbol"], "convert": currency},
                    headers=headers
                )
                data = r.json()["data"][COINS[coin]["symbol"]]["quote"][currency]

                coin_data[currency] = CurrencyData(
                    price=data["price"],
                    volume_24h=data["volume_24h"],
                    market_cap=data["market_cap"],
                    volume_change_24h=data["volume_change_24h"],
                    percent_change_1h=data["percent_change_1h"],
                    percent_change_24h=data["percent_change_24h"],
                    percent_change_7d=data["percent_change_7d"],
                    percent_change_30d=data["percent_change_30d"],
                    percent_change_60d=data["percent_change_60d"],
                    percent_change_90d=data["percent_change_90d"],
                    symbol=symbol,
                    name=currency
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

    coin_model = COINS[coin]["model"](
        USD=coin_data.get("USD"),
        EUR=coin_data.get("EUR"),
        BTC=coin_data.get("BTC"),
        ILS=coin_data.get("ILS"),
        last_updated=datetime.now().isoformat()
    )

    collection = COINS[coin]["collection"]
    await collection.insert_one(coin_model.model_dump())

    return coin_model


@router.delete("/{coin}")
async def delete_coin(coin: str):
    if coin not in COINS:
        raise HTTPException(status_code=404, detail="Coin not supported")
    collection = COINS[coin]["collection"]
    await collection.delete_many({})
    return {"message": f"All {coin.upper()} documents deleted"}
