from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from . import models
from fastapi import HTTPException


def get_all_products(db: Session):
    try:
        return db.query(models.Products).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


def get_products_by_category(db: Session, category: str):
    return db.query(models.Products).filter(models.Products.product_category.ilike(category)).all()


def search_products(db: Session, query: str):
    exact_match = db.query(models.Products).filter(
        models.Products.product_name.ilike(f"%{query}%")).all()
    partial_matches = db.query(models.Products).filter(
        models.Products.product_name.ilike(f"%{query}%")).all()
    # Remove exact matches from partial_matches to prevent duplicates
    partial_matches = [
        product for product in partial_matches if product not in exact_match]
    return exact_match + partial_matches


def get_products_by_store(db: Session, store_name: str):
    return db.query(models.Products).filter(models.Products.product_store_name.ilike(store_name)).all()
