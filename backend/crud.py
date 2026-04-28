import models, schemas
from sqlalchemy.orm import Session


# Read Presses
def get_presses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Press).offset(skip).limit(limit).all()

# Create Press
def create_press(db: Session, press: schemas.PressCreate):
    db_press = models.Press(name=press.name, state=press.state)
    db.add(db_press)
    db.commit()
    db.refresh(db_press)

    return db_press

# Read Molds
def get_molds(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Mold).offset(skip).limit(limit).all()

# Create Mold
def create_mold(db: Session, mold: schemas.MoldCreate):
    db_mold = models.Mold(
        code = mold.code,
        time_change_minutes = mold.time_change_minutes
    )
    db.add(db_mold)
    db.commit()
    db.refresh(db_mold)

    return db_mold

# Read References
def get_references(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reference).offset(skip).limit(limit).all()

# Create Reference
def create_reference(db: Session, reference: schemas.ReferenceCreate):
    db_reference = models.Reference(
        article_code =reference.article_code,
        descriptions = reference.descriptions,
        cicle_seconds = reference.cicle_seconds,
        pieces_per_circle = reference.pieces_per_circle,
        mold_id = reference.mold_id
    )
    db.add(db_reference)
    db.commit()
    db.refresh(db_reference)

    return db_reference

# Read Orders
def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

# Create Order
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        order_number = order.order_number,
        client = order.client,
        quantity = order.quantity,
        delivery_date=order.delivery_date,
        state=order.state,
        reference_id=order.reference_id,
        press_id=order.press_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return db_order
