import os

import pytest
import requests
from dotenv import load_dotenv


load_dotenv()


API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8080/api")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@agrogreen.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


def build_url(path: str) -> str:
    return f"{API_BASE_URL}{path}"


@pytest.fixture(scope="session")
def admin_token():
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    }

    response = requests.post(
        build_url("/auth/login"),
        json=payload,
        timeout=10,
    )

    assert response.status_code == 200, response.text

    data = response.json()

    assert "token" in data
    assert data["token"]

    return data["token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json",
    }


def test_status_endpoint_should_be_public():
    response = requests.get(
        build_url("/status"),
        timeout=10,
    )

    assert response.status_code == 200
    assert response.text


def test_login_should_return_admin_token():
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    }

    response = requests.post(
        build_url("/auth/login"),
        json=payload,
        timeout=10,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "ADMIN"
    assert "token" in data
    assert data["token"]


def test_profile_endpoint_should_return_current_user(admin_headers):
    response = requests.get(
        build_url("/auth/me"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "ADMIN"
    assert data["status"] == "ACTIVE"


def test_users_endpoint_should_be_available_for_admin(admin_headers):
    response = requests.get(
        build_url("/users"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1

    first_user = data[0]

    assert "id" in first_user
    assert "fullName" in first_user
    assert "email" in first_user
    assert "role" in first_user
    assert "status" in first_user


def test_greenhouses_endpoint_should_be_available_for_admin(admin_headers):
    response = requests.get(
        build_url("/greenhouses"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_zones_endpoint_should_be_available_for_admin(admin_headers):
    response = requests.get(
        build_url("/zones"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_sensors_endpoint_should_be_available_for_admin(admin_headers):
    response = requests.get(
        build_url("/sensors"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_alerts_endpoint_should_be_available_for_admin(admin_headers):
    response = requests.get(
        build_url("/alerts"),
        headers=admin_headers,
        timeout=10,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_protected_endpoint_without_token_should_return_unauthorized():
    response = requests.get(
        build_url("/users"),
        timeout=10,
    )

    assert response.status_code == 401