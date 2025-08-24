from pydantic import BaseModel

class CurrencyData(BaseModel):
    price: float
    volume_24h: float
    market_cap: float
    volume_change_24h: float
    percent_change_1h: float
    percent_change_24h: float
    percent_change_7d: float
    percent_change_30d: float
    percent_change_60d: float
    percent_change_90d: float
    symbol: str
    name:str
