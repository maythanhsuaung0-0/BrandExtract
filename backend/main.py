from fastapi import FastAPI
from routers import auth, users, brands, extract
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- Change to your frontend's URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth")
app.include_router(users.router, prefix="/api/users")
app.include_router(brands.router, prefix="/api/brands")
app.include_router(extract.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
