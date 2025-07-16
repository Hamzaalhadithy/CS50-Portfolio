from flask import Flask, flash ,render_template, redirect, request, session, url_for, jsonify
from flask_session import Session
from cs50 import SQL
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps

app = Flask(__name__)
app.secret_key = 'alhadeethimo'


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

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

@app.route("/articles")
def article():
    articles = db.execute("SELECT * FROM articles")
    return jsonify(articles), 200

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("Loged Out")
    return redirect(url_for('index'))

    