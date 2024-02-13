from pydantic import BaseModel
from typing import Optional


class Products(BaseModel):
    timestamp: str
    product_name: str
    product_price: str
    product_units: Optional[str]
    product_image: str
    product_category: str
    product_store_name: str
