from fastapi import FastAPI
from pyServer.routes import coin
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register coin routes
app.include_router(coin.router, prefix="/api", tags=["coin"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)