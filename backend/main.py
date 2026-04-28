from fastapi import FastAPI, Depends
from database import engine, SessionLocal
from typing import List
from sqlalchemy.orm import Session
import models, schemas, crud

# Create tables in PostgreSQL
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI 
app = FastAPI(
    title="App API",
    description="Backend system for App",
)

# Open connection to database for each web request and closes it when it finishes
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Route test 
@app.get("/")

def read_root():
    return {"Message": "Industrial Management App server is working!"}

# ------ ENDPOINTS FOR PRESSES  ------
@app.post("/presses/", response_model=schemas.Press)

def create_press(press: schemas.PressCreate, db: Session = Depends(get_db)):
    return crud.create_press(db=db, press=press)

@app.get("/presses/", response_model=List[schemas.Press])

def read_presses(skip: int = 0, limit: int=100, db: Session = Depends(get_db)):
    presses = crud.get_presses(db, skip=skip, limit=limit)
    return presses

# ------ ENDPOINTS FOR MOLDS  ------
@app.post("/molds/", response_model=schemas.Mold)

def create_mold(mold: schemas.MoldCreate, db: Session = Depends(get_db)):
    return crud.create_mold(db=db, mold=mold)

@app.get("/molds/", response_model=List[schemas.Mold])

def read_molds(skip: int = 0, limit: int=100, db: Session = Depends(get_db)):
    molds = crud.get_molds(db, skip=skip, limit=limit)
    return molds

# ------ ENDPOINTS FOR MOLDS  ------
@app.post("/references/", response_model=schemas.Reference)

def create_reference(reference: schemas.ReferenceCreate, db: Session = Depends(get_db)):
    return crud.create_reference(db=db, reference=reference)

@app.get("/references/", response_model=List[schemas.Reference])

def read_references(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_references(db, skip=skip, limit=limit)

# ------ ENDPOINTS FOR ORDERS  ------
@app.post("/orders/", response_model=schemas.Order)

def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/orders/", response_model=List[schemas.Order])

def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_orders(db, skip=skip, limit=limit)