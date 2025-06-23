from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/search')
def search():
    query = request.args.get('q', '').lower()
    conn = get_db_connection()
    products = conn.execute("SELECT * FROM products WHERE LOWER(name) LIKE ?", ('%' + query + '%',)).fetchall()
    conn.close()
    result = [dict(row) for row in products]
    return jsonify(result)

@app.route('/conversation', methods=['POST'])
def conversation():
    data = request.json
    conn = get_db_connection()
    conn.execute("INSERT INTO conversations (user, message, timestamp) VALUES (?, ?, ?)",
                 (data.get('user'), data.get('message'), datetime.datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return '', 204

@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    data = request.json
    conn = get_db_connection()
    conn.execute("INSERT INTO cart (user, product_id, quantity) VALUES (?, ?, ?)",
                 (data.get('user'), data.get('product_id'), data.get('quantity')))
    conn.commit()
    conn.close()
    return jsonify({"status": "added to cart"})

@app.route('/cart/view')
def view_cart():
    user = request.args.get('user')
    conn = get_db_connection()
    items = conn.execute('''
        SELECT products.name, products.price, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user = ?
    ''', (user,)).fetchall()
    conn.close()
    result = [dict(row) for row in items]
    return jsonify(result)

@app.route('/cart/checkout', methods=['POST'])
def checkout():
    user = request.json.get('user')
    conn = get_db_connection()
    conn.execute("DELETE FROM cart WHERE user = ?", (user,))
    conn.commit()
    conn.close()
    return jsonify({"status": "checkout complete"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Simple: accept any username/password
    token = "test-jwt-token"
    
    return jsonify({"token": token})

if __name__ == '__main__':
    app.run(debug=True)

