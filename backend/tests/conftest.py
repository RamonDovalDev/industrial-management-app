import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, get_db
from database import Base,SQLALCHEMY_DATABASE_URL

# Create a database engine for the test 
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()

    # Initialize a transaction
    transaction= connection.begin()

    # Create the linked session to the transaction
    session = TestingSessionLocal(bind=connection)

    yield session # Here the test executes

    # When test finishes, close and remove
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    # Override function "get_db()" from FastAPI for using session with rollback
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient
    yield TestClient(app)
    # When test is finished, clean the overrride
    del app.dependency_overrides[get_db]


