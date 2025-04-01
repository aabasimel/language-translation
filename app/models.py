from sqlalchemy import Column, Integer, String, Text
from .database import Base
from sqlalchemy.orm import DeclarativeBase



class Base(DeclarativeBase):
    pass


class Translation(Base):
    __tablename__ = "translations"
    id = Column(Integer, primary_key=True, index=True)
    original_text = Column(String, nullable=False)
    translations = Column(String, nullable=False)  # Store translated texts in JSON-like format
    status = Column(String, default="success")