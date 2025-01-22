from flask import Blueprint, request, jsonify
from main import db
from models import Categories

category_bp = Blueprint('category', __name__)

@category_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = Categories.query.all()
    
    # json_categories = [{"id": cat.id, "name": cat.name} for cat in categories]
    json_categories = list(map(lambda x: x.to_json(), categories))
    
    return jsonify({"categories": json_categories})

@category_bp.route("/add_category", methods=["POST"])
def add_category():
    category_name = request.json.get('name')
    
    if not category_name:
        return jsonify({"error": "Category name is required"}), 400

    new_category = Categories(name=category_name)

    try:
        db.session.add(new_category)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500

    return jsonify({"message": "Category added successfully"}), 201

@category_bp.route("/delete_category/<int:id>", methods=["DELETE"])
def delete_category(id):
    category = Categories.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    try:
        db.session.delete(category)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500

    return jsonify({"message": "Category deleted successfully"}), 200

@category_bp.route("/edit_category/<int:id>", methods=["PATCH"])
def edit_category(id):
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"error": "New category name is required"}), 400

    category = Categories.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    try:
        category.name = data["name"]
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An error occurred: {e}"}), 500

    return jsonify({"message": "Category updated successfully"}), 200
