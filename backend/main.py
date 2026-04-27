from fastapi import FastAPI
import models
from database import engine

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI 
app = FastAPI(
    title="App API",
    description="Backend system for App",
)

# Route test 
@app.get("/")

def read_root():
    return {"Message": "Industrial Management App server is working!"}