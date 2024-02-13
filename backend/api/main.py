from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi_pagination import Page, add_pagination, paginate
from fastapi_pagination import Params
from sqlalchemy.orm import Session
from aiocache import cached

from . import crud, models, schemas
from .database import SessionLocal, engine
from typing import Optional

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Grocery Prices API", version="0.0.6")
add_pagination(app)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/products", response_model=Page[schemas.Products], tags=["Grocery Products"])
def read_products(page: Optional[int] = Query(1, alias="page"), db: Session = Depends(get_db)):
    products = crud.get_all_products(db)
    if not products:
        raise HTTPException(status_code=404, detail="Products not found")

    # Get the pagination parameters
    params = Params(page=page, size=50)  # Assuming size is fixed at 50

    # Calculate the total number of pages
    total_items = len(products)
    total_pages = (total_items + params.size - 1) // params.size

    # Check if the requested page number is valid
    if page < 1 or page > total_pages:
        raise HTTPException(
            status_code=404, detail="Page not found")

    # Paginate the products using the parameters
    return paginate(products, params)


@app.get("/products/category/{category}", response_model=Page[schemas.Products], tags=["Grocery Products"])
def read_products_by_category(category: str, db: Session = Depends(get_db)):
    products = crud.get_products_by_category(db, category)
    if not products:
        raise HTTPException(
            status_code=404, detail=f"Products with category {category} not found"
        )
    return paginate(products)


@cached(ttl=3600)
@app.get("/products/search/{query}", response_model=Page[schemas.Products], tags=["Grocery Products"])
def search_products(query: str, db: Session = Depends(get_db)):
    products = crud.search_products(db, query)
    if not products:
        raise HTTPException(
            status_code=404, detail=f"No products found for query: '{query}'")
    return paginate(products)


@app.get("/products/store/{store_name}", response_model=Page[schemas.Products], tags=["Grocery Products"])
def read_products_by_store(store_name: str, db: Session = Depends(get_db)):
    products = crud.get_products_by_store(db, store_name)
    if not products:
        raise HTTPException(
            status_code=404, detail=f"Products in store '{store_name}' not found")
    return paginate(products)
