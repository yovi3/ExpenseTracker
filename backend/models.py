from main import db

class Expenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))
    amount = db.Column(db.Float)
    short_description = db.Column(db.String(100))

    def to_json(self):
        return {
            "id": self.id,
            "category": self.category,
            "amount": self.amount,
            "shortDescription": self.short_description
        }    
    
class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name
            }