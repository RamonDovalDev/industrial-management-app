from pydantic import BaseModel, ConfigDict, computed_field
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
    model_config = ConfigDict(from_attributes=True)

# Update a press
class PressUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] =  None

# SCHEMAS FOR "MOLD" ENTITY
class MoldBase(BaseModel):
    code: str
    time_change_minutes: Optional[int] = 60

class MoldCreate(MoldBase):
    pass

class Mold(MoldBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# SCHEMES FOR "PRESS" ENTITY
class ReferenceBase(BaseModel):
    article_code: str
    descriptions: Optional[str] = None
    cycle_seconds: float
    pieces_per_cycle: Optional[int ]= 1
    mold_id: Optional[int] = None

class ReferenceCreate(ReferenceBase):
    pass

class Reference(ReferenceBase):
    id: int
    mold: Optional[Mold] = None
    model_config = ConfigDict(from_attributes=True)

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
    planned_start: Optional[datetime] = None
    reference: Optional[Reference] = None
    press: Optional[Press] = None
    #duration_minutes: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)
    @computed_field
    @property
    def duration_minutes(self) -> float:
        if self.reference and self.quantity:
            return (self.quantity / self.reference.pieces_per_cycle) * (self.reference.cycle_seconds / 60)
        return 0.0

class OrderUpdate(BaseModel):
    press_id: Optional[int] = None
    state: Optional[str] = None
    delivery_date: Optional[datetime] = None
    planned_start: Optional[datetime] = None
    quantity: Optional[int] = None
