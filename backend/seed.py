# Generate fake data to the Database

from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import Press, Mold, Reference, Order

def load_test_data():
    print("Emtying database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    print("Initializing data injection...")

    try:
        press1 = Press(name="Press Engel 200T", state="active")
        press2 = Press(name="Press Arburg 100T", state="active")
        press3 = Press(name="KraussMaffei 300T", state="maintenance") 
        press4 = Press(name="Netstal 150T", state="active")
        db.add_all({press1, press2, press3, press4})
        db.commit()

        mold1 = Mold(code="MOLD-A1", time_change_minutes=45)
        mold2 = Mold(code="MOLD-B2", time_change_minutes=60)
        mold3 = Mold(code="MOLD-C-3", time_change_minutes=120)
        db.add_all({mold1, mold2, mold3})
        db.commit()

        ref1 = Reference(
            article_code = "TRAY-STD", 
            description = "Standard Tray 30x40", 
            cycle_seconds = 15.0, 
            pieces_per_cycle = 1, 
            mold_id = mold1.id
        )
        ref2 = Reference(
            article_code = "TRAY-PREM", 
            description = "Premium Acrylic Tray", 
            cycle_seconds = 25.0, 
            pieces_per_cycle = 2, 
            mold_id = mold2.id
        )
        ref3 = Reference(
            article_code = "COP-X", 
            description = "Polypropylene Cup", 
            cycle_seconds = 8.0, 
            pieces_per_cycle = 4, 
            mold_id = mold3.id
        )

        # Trial order
        today = datetime.now()

        test_orders = [
            Order(order_number="ORD-2001", client="Air France", quantity=10000, 
                  delivery_date=today + timedelta(days=10), state="production", reference=ref1, press=press1),
            
            Order(order_number="ORD-2002", client="Amazon Hub", quantity=15000, 
                  delivery_date=today + timedelta(days=1), state="planned", reference=ref3, press=press1),
            
            Order(order_number="ORD-2003", client="IKEA", quantity=50000, 
                  delivery_date=today + timedelta(days=15), state="planned", reference=ref1, press=press1),
            
            Order(order_number="ORD-2004", client="Wallmart", quantity=8000, 
                  delivery_date=today + timedelta(days=7), state="pending", reference=ref2),
            
            Order(order_number="ORD-2005", client="Decathlon", quantity=12000, 
                  delivery_date=today + timedelta(days=4), state="planned", reference=ref2, press=press1),
           
            Order(order_number="ORD-2006", client="Hospital Central", quantity=2500, 
                  delivery_date=today, state="production", reference=ref3, press=press4),

            Order(order_number="ORD-2007", client="Pasticceria Roma", quantity=1000, 
                  delivery_date=today + timedelta(days=2), state="pending", reference=ref1),

            Order(order_number="ORD-2008", client="Mercedes Benz (VIP)", quantity=5000, 
                  delivery_date=today + timedelta(days=12), state="planned", reference=ref2, press=press2),

            Order(order_number="ORD-2009", client="Tech Data", quantity=3000, 
                  delivery_date=today - timedelta(days=2), state="planned", reference=ref1, press=press1),

            Order(order_number="ORD-2010", client="Global Logistics", quantity=100000, 
                  delivery_date=today + timedelta(days=30), state="pending", reference=ref3)
        ]

        db.add_all(test_orders)

        db.commit()
        print(f"Éxito: 4 máquinas, 3 moldes y {len(test_orders)} pedidos inyectados.")

    except Exception as e:
        db.rollback()
        print(f"Error inserting data: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    load_test_data()
        
