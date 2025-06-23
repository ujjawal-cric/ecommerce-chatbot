import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

# PRODUCTS TABLE
c.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    price REAL,
    brand TEXT,
    rating REAL,
    stock INTEGER,
    image_url TEXT
)
''')

# CONVERSATIONS TABLE
c.execute('''
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    message TEXT,
    timestamp TEXT
)
''')

# CART TABLE
c.execute('''
CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    product_id INTEGER,
    quantity INTEGER
)
''')

# Clear old data
c.execute('DELETE FROM products')
c.execute('DELETE FROM conversations')
c.execute('DELETE FROM cart')

for i in range(1, 101):
    image_url = f"https://picsum.photos/seed/{i}/150"
    c.execute("INSERT INTO products (name, category, price, brand, rating, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
              (f"Product {i}", "Electronics", 100 + i, f"Brand{i}", 4.0 + (i % 5) * 0.1, 10 + (i % 50), image_url))

# Insert sample electronics products
products = [
    ("iPhone 14", "Electronics", 799.99, "Apple", 4.8, 20, "https://source.unsplash.com/featured/?iphone"),
    ("Samsung TV", "Electronics", 599.99, "Samsung", 4.7, 10, "https://source.unsplash.com/featured/?tv"),
    ("Sony Headphones", "Electronics", 129.99, "Sony", 4.5, 50, "https://source.unsplash.com/featured/?headphones"),
    ("Dell Laptop", "Electronics", 999.99, "Dell", 4.6, 15, "https://source.unsplash.com/featured/?laptop"),
    ("Canon Camera", "Electronics", 549.99, "Canon", 4.4, 8, "https://source.unsplash.com/featured/?camera"),
    ("Logitech Mouse", "Electronics", 29.99, "Logitech", 4.3, 100, "https://source.unsplash.com/featured/?mouse"),
    ("JBL Speaker", "Electronics", 199.99, "JBL", 4.5, 30, "https://source.unsplash.com/featured/?speaker"),
    ("Apple Watch", "Electronics", 399.99, "Apple", 4.7, 25, "https://source.unsplash.com/featured/?watch"),
    ("Lenovo Tablet", "Electronics", 299.99, "Lenovo", 4.4, 18, "https://source.unsplash.com/featured/?tablet"),
    ("HP Printer", "Electronics", 159.99, "HP", 4.2, 12, "https://source.unsplash.com/featured/?printer"),
]


for p in products:
    c.execute("INSERT INTO products (name, category, price, brand, rating, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)", p)

conn.commit()
conn.close()

print("Database created and populated with 100+ products ✅")
