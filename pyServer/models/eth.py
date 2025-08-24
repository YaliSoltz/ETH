from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from pyServer.models.currency import CurrencyData

class ETH(BaseModel):
    USD: Optional[CurrencyData]
    EUR: Optional[CurrencyData]
    BTC: Optional[CurrencyData]
    ILS: Optional[CurrencyData]
    last_updated: str
    time: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
