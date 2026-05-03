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

# Update press
def update_press(db: Session, press_id: int, press_update: schemas.PressUpdate):
    # Search for the press with "id"
    db_press = db.query(models.Press).filter(models.Press.id == press_id).first()
    if db_press:
        # Just update the field user has requested
        if press_update.name is not None:
            db_press.name = press_update.name
        if press_update.state is not None:
            db_press.state = press_update.state
        
        db.commit()
        db.refresh(db_press)
    
    return db_press

# Delete a press
def delete_press(db: Session, press_id: int):
    db_press = db.query(models.Press).filter(models.Press.id == press_id).first()
    if db_press:
        db.delete(db_press)
        db.commit()
        return True
    return False

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
        description = reference.descriptions,
        cycle_seconds = reference.cicle_seconds,
        pieces_per_cycle = reference.pieces_per_circle,
        mold_id = reference.mold_id
    )
    db.add(db_reference)
    db.commit()
    db.refresh(db_reference)

    return db_reference

# Read Orders
def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(models.Order).offset(skip).limit(limit).all()

    # Calculate duration for each order before sending
    for order in orders:
        if order.reference:
            total_seconds = (order.quantity / order.reference.pieces_per_cycle) * order.reference.cycle_seconds
            order.duration_minutes = total_seconds / 60
        else:
            order.duration_minutes = 0
    
    return orders

# Create Order
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        order_number = order.order_number,
        client = order.client,
        quantity = order.quantity,
        delivery_date = order.delivery_date,
        state= order.state,
        reference_id = order.reference_id,
        press_id = order.press_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return db_order

# Update Order
def update_order(db: Session, order_id: int, order_update: schemas.OrderUpdate):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        # Turn schema into a Dict but exclude what has no requested 
        update_data = order_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_order, key, value)

    db.commit()
    db.refresh(db_order)

    return db_order
    
