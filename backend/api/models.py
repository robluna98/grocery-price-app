from sqlalchemy import Column, VARCHAR
from .database import Base


class Products(Base):
    __tablename__ = 'products'

    timestamp = Column(VARCHAR, primary_key=True)
    product_name = Column(VARCHAR)
    product_price = Column(VARCHAR)
    product_units = Column(VARCHAR, nullable=True)
    product_image = Column(VARCHAR)
    product_category = Column(VARCHAR)
    product_store_name = Column(VARCHAR)
