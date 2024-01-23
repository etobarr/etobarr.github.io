from flask import Flask, render_template, request, url_for, redirect
import sqlite3

app = Flask(__name__)

# Database setup (SQLite in this case)
def init_db():
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages (content TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Home Page
@app.route('/')
def index():
    return render_template('index.html')

# About Page
@app.route('/about')
def about():
    return render_template('about.html')

# Dynamic URL example
@app.route('/hello/<name>')
def hello(name):
    return 'Hello, {}!'.format(name)

# Form page
@app.route('/message', methods=['GET', 'POST'])
def message():
    if request.method == 'POST':
        content = request.form['content']
        conn = sqlite3.connect('example.db')
        c = conn.cursor()
        c.execute("INSERT INTO messages (content) VALUES (?)", (content,))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('message.html')

if __name__ == '__main__':
    app.run(debug=True)
