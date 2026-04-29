from fastapi.testclient import TestClient
from main import app

# Generate a test client
client = TestClient(app)

def test_read_main():
    # Simulate a GET request to root
    response = client.get("/")

    # Check if status code = 200 (everything OK)
    assert response.status_code == 200

    # Check if response message is successful
    assert response.json() == {"message": "Industrial Management App server is working!"}