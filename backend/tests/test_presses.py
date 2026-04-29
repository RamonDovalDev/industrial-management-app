# Test for creating a new press
def test_create_press(client):  # Client comes from "conftest.py"
    press_data = {"name": "Automatized Test Press", "state": "active"}
    response = client.post("/presses", json=press_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Automatized Test Press"

# Test for updating a press
def test_update_press(client):
    # 1. First create a new press to have something to update
    create_resp = client.post("/presses/", json={
        "name": "Original press",
        "state": "active"
    })
    press_id = create_resp.json()['id']

    # 2. Send PUT request to the just created ID
    update_data = {
        "name": "Updated press",
        "state": "active"
    }
    update_resp = client.put(f"/presses/{press_id}", json=update_data)

    # 3. Check if server response is OK (status_code = 200)
    assert update_resp.status_code == 200

    # 4. Verify if the return data are the requested
    data = update_resp.json()
    assert data['name'] == "Updated press"
    assert data['state'] == "active"
    # ID must be the same
    assert data['id'] == press_id

# Test for deleting a press
def test_delete_press(client):
    create_resp = client.post("/presses/", json={
        "name": "Press to delete",
        "state": "inactive"
    })
    press_id = create_resp.json()['id']

    delete_resp = client.delete(f"/presses/{press_id}")
    assert delete_resp.status_code == 200
    assert delete_resp.json()['message'] == "Press deleted successfully!"

    # Try toi delete the press again to obtain status_code = 404
    retry_delete = client.delete(f"/presses/{press_id}")
    assert retry_delete.status_code == 404

    

