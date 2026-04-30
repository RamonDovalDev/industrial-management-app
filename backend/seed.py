# Generate fake data to the Database

from datetime import datetime, timedelta
from database import SessionLocal
from models import Press, Mold, Reference, Order

def load_test_data():
    db = SessionLocal()
    print("Initializing data injection...")

    try:
        press1 = Press(name="Press Engel 200T", state="active")
        press2 = Press(name="Press Arburg 100T", state="active")

        mold1 = Mold(code="MOLD-A1", time_change_minutes=45)
        mold2 = Mold(code="MOLD-B2", time_change_minutes=60)

        ref1 = Reference(
            article_code = "TRAY-STD", 
            description = "Standard Tray 30x40", 
            cycle_seconds = 15.0, 
            pieces_per_cycle = 1, 
            mold = mold1
        )
        ref2 = Reference(
            article_code = "TRAY-PREM", 
            description = "Premium Acrylic Tray", 
            cycle_seconds = 25.0, 
            pieces_per_cycle = 2, 
            mold = mold2
        )

        # Trial order
        today = datetime.now()
        order1 = Order(
            order_number = "ORD-1001",
            client = "Restaurant La Bonne Fourchette",
            quantity = 5000,
            delivery_date = today + timedelta(days=5), # Delivery in 5 days
            state = "pending",
            reference = ref1 
        )
        
        order2 = Order(
            order_number = "ORD-1002",
            client = "Hotel Le Paris",
            quantity = 2000,
            delivery_date = today + timedelta(days=2), # Urgent!In 2 days
            state = "planned",
            reference = ref2, 
            press = press2 # Machine for the Gantt!
        )

        db.add_all([press1, press2, mold1, mold2, ref1, ref2, order1, order2])

        db.commit()
        print("Test data inserted successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error inserting data: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    load_test_data()
        
