from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Connection URL to local database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Nocturnal1/@localhost:5432/industrial-management-db"

# Engine to manage connections
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Class Base which models will inherit
Base = declarative_base()