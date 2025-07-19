import os
from flask import Flask, flash ,render_template, redirect, request, session, url_for, jsonify
from flask_session import Session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from flask_mail import Mail, Message
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USER")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASS")
app.config['MAIL_DEFAULT_SENDER'] = 'hamzaalseade@gmail.com'

mail = Mail(app)

db = SQL("sqlite:///main.db")

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log in for admins"""

    if request.method == "POST":
        session.clear()
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            flash("Please Enter your info!", "danger")
            return redirect(url_for('login'))
        
        rows = db.execute(
            "SELECT * FROM admins WHERE username = ?", username
            )
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            flash("Your Password is Incorrect", "danger")
            return redirect(url_for('login'))
        
        session['user_id'] = rows[0]["id"]
        flash("Login successful!", "success")
        return redirect("/")
    
    return render_template("login.html")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/blog") 
def blog():
    return render_template("blog.html", user_id=session.get("user_id"))

@app.route("/api/articles")
def article():
    articles = db.execute("SELECT * FROM articles")
    return jsonify(articles), 200

@app.route("/api/articles/<int:article_id>")
def get_article(article_id):
    article = db.execute("SELECT * FROM articles WHERE id = ?", article_id)

    if not article:
        return jsonify({"error" : "Article not found"}), 404
    
    return jsonify(article[0]), 200

@app.route("/api/articles/search")
def search_articles():
    query = request.args.get("query")
    if not query:
        return jsonify({"error":"No search query provied"}), 404

    like_query = "%" + query + "%"
    articles = db.execute("SELECT * FROM articles WHERE title LIKE ? OR content LIKE ?", like_query, like_query)
    return jsonify(articles), 200

@app.route("/api/articles/create", methods=["POST"])
def create_article():
    if "user_id" not in session:
        return jsonify({"error": "Not authorized"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data was sent"}), 404
    
    if not all (key in data for key in ("image_url", "title", "content")):
        return jsonify({"error":"Missing required fields"}), 404
    
    db.execute(
        "INSERT INTO articles (title, content, image_url, author_id) VALUES (?, ?, ?, ?)",
          data['title'], data['content'], data['image_url'], session['user_id']
          )
    return jsonify({"success": True}), 200

@app.route("/api/articles/<int:article_id>/edit", methods=["PUT"])
def edit_article(article_id):
    data = request.get_json()

    if not data:
        return jsonify({"Error": "Didn't submit any content"}), 404
    
    # validate required fields
    if not all (key in data for key in ("image_url", "title", "content")):
        return jsonify({"error" : "Missing required fields"}), 400
    
    #check if article exists
    article = db.execute("SELECT * FROM articles WHERE id = ?", article_id)
    if not article:
        return jsonify({"error" : "aticled doesn't exist"}), 404
    
    # Update article
    db.execute(
        "UPDATE articles SET image_url = ?, title = ?, content = ? WHERE id = ?",
          data['image_url'], data['title'], data['content'], article_id)
    
    return jsonify({"Success" : True}), 200



@app.route("/api/articles/<int:article_id>/delete", methods=["DELETE"])
def del_article(article_id):

    article = db.execute("SELECT * FROM articles WHERE id = ?", article_id)
    if not article:
        return jsonify({"error":"Article doesn't exist"}), 404
    
    db.execute("DELETE FROM articles WHERE id = ?", article_id)
    return jsonify({"success": True}), 200


@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/api/projects")
def get_projects():
    projects = db.execute("SELECT * FROM projects")
    if not projects:
        return jsonify({"error":"No projects were found"}), 404
    return jsonify(projects), 200


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        msg = Message(
            subject=f"New Contact Message from {name}",
            recipients=["hamzaalseade@gmail.com"],
            body =f"From: {name}\nEmail: {email}\nMessage: {message}"
        )

        try:
            mail.send(msg)
            flash("Your message has been sent Successfully!", "success")
        except Exception as e:
            print("❌ Mail send failed:", e)
            flash("Failed to send message. Try again later", "danger")

        return redirect("/contact")
    
    return render_template("contact.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("Logged Out")
    return redirect(url_for('login'))

    