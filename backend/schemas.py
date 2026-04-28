from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# SCHEMES FOR "PRESS" ENTITY
# Base: what a Press always has
class PressBase(BaseModel):
    name: str
    state: Optional[str] = "active"

# Create: What we demand when Frontend wants to create a Press
class PressCreate(PressBase):
    # Inherit all PressBase
    pass 

# Response: what we return to the Frontend when asks for a Press
class Press(PressBase):
    id: int

    # Class that turns SQL to JSON
    class Config:
        from_attributes = True

# SCHEMAS FOR "MOLD" ENTITY
class MoldBase(BaseModel):
    code: str
    time_change_minutes: Optional[int] = 60

class MoldCreate(MoldBase):
    pass

class Mold(MoldBase):
    id: int

    class Config:
        from_attributes = True

# SCHEMES FOR "PRESS" ENTITY
class ReferenceBase(BaseModel):
    article_code: str
    descriptions: Optional[str] = None
    cicle_seconds: float
    pieces_per_circle: Optional[int ]= 1
    mold_id: Optional[int] = None

class ReferenceCreate(ReferenceBase):
    pass

class Reference(ReferenceBase):
    id: int

    class Config:
        from_attributes = True

# SCHEMAS FOR "ORDER" ENTITY
class OrderBase(BaseModel):
    order_number: str
    client: str
    quantity: int
    delivery_date: datetime
    state: Optional[str] = "pending"
    reference_id: int
    press_id: Optional[int] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int

    class Config:
        from_attributes = True
