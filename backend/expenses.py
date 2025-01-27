from flask import Blueprint, request, jsonify
from main import db
from models import Expenses
from datetime import datetime

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expenses.query.all()
    json_expenses = list(map(lambda x: x.to_json(), expenses))
    return jsonify({"expenses": json_expenses})

@expenses_bp.route("/add_expense", methods=["POST"])
def add_expense():
    data = request.get_json()
    
    now = datetime.now()
    formatted_datetime = now.strftime("%d %B %Y, %H:%M")
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # 21 January 2025, 12:30
    new_expense = Expenses(category=data["category"], amount=data["amount"], date_and_time=formatted_datetime, short_description=data["shortDescription"])
    
    try:
        db.session.add(new_expense)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500
    
    return "Expense added", 201 

@expenses_bp.route("/delete_expense/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expenses.query.get(id)
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    try:
        db.session.delete(expense)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500
        
    return "Expense deleted", 200

@expenses_bp.route("/update_expense/<int:id>", methods=["PATCH"])
def update_expense(id):
    expense = Expenses.query.get(id)
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        expense.category = data["category"]
        expense.amount = data["amount"]
        expense.short_description = data["shortDescription"]
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500
    
    return "Expense updated", 200

