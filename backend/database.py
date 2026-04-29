import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connection URL to local database
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Error handler
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL not found!")

# Engine to manage connections
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Class Base which models will inherit
Base = declarative_base() 