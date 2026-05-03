from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
# Importamos la clase Base que creaste en el paso anterior
from database import Base 

class Press(Base):
    __tablename__ = "presses" # PostgreSQL table name
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    state = Column(String, default="activa") # Ex: active, inactive, maintenance
    
    # Relation: To access easily to the planned orders in this press
    orders = relationship("Order", back_populates="press")

class Mold(Base):
    __tablename__ = "molds"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    time_change_minutes = Column(Integer, default=60) # Vital for Gantt
    
    # Relation: One mold produces several references (products)
    references = relationship("Reference", back_populates="mold")

class Reference(Base):
    __tablename__ = "references"
    
    id = Column(Integer, primary_key=True, index=True)
    article_code = Column(String, unique=True, index=True)
    description = Column(String)
    cycle_seconds = Column(Float)
    pieces_per_cycle = Column(Integer, default=1)
    
    # Llave foránea: Esto vincula la referencia a un molde específico
    mold_id = Column(Integer, ForeignKey("molds.id"))
    
    # Relations to browse between objects in Python
    mold = relationship("Mold", back_populates="references")
    orders = relationship("Order", back_populates="reference")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True) # Ex: PO-12345 from MBC
    client = Column(String)
    quantity = Column(Integer)
    delivery_date = Column(DateTime)
    planned_start = Column(DateTime, nullable=True)
    state = Column(String, default="pending") # pending, planned, production, finished
    
    # Foreign keys
    reference_id = Column(Integer, ForeignKey("references.id"))

    # New order doesn't have assigned press
    press_id = Column(Integer, ForeignKey("presses.id"), nullable=True) 
    
    # Relations
    reference = relationship("Reference", back_populates="orders")
    press = relationship("Press", back_populates="orders")
