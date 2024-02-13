from fastapi.testclient import TestClient
from ..main import app, get_db
from ..database import SessionLocal
from fastapi_pagination import add_pagination

import pytest


@pytest.fixture
def test_app():
    app.dependency_overrides[get_db] = lambda: SessionLocal()
    # Add this line to enable pagination support in your tests
    add_pagination(app)
    return TestClient(app)


def test_read_products(test_app):
    response = test_app.get("/products?page=1")
    assert response.status_code == 200
    assert "items" in response.json()


def test_read_products_by_category(test_app):
    response = test_app.get("/products/category/produce?page=1")
    assert response.status_code == 200
    assert "items" in response.json()


def test_search_products(test_app):
    response = test_app.get("/products/search/banana?page=1")
    assert response.status_code == 200
    assert "items" in response.json()


def test_read_products_by_store(test_app):
    response = test_app.get("/products/store/heb?page=1")
    assert response.status_code == 200
    assert "items" in response.json()
