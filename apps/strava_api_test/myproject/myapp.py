from flask import Flask, render_template, request, url_for, redirect, session
import sqlite3
import requests
import os
import logging

app = Flask(__name__)
app.secret_key = '!@#super_secret_key321456'

# Database setup
def init_db():
    with sqlite3.connect('/home/etobarr/myproject/apps/strava_api_test/myproject/working') as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS messages (content TEXT)''')
        c.execute('''CREATE TABLE IF NOT EXISTS strava_tokens (user_id INTEGER PRIMARY KEY, access_token TEXT)''')
        conn.commit()

# Strava OAuth Configuration
STRAVA_CLIENT_ID = '116573'
STRAVA_CLIENT_SECRET = 'f178359239fbb2c061697c8163a874471ca263de'
STRAVA_AUTH_BASE_URL = 'https://www.strava.com/oauth/authorize'
STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
REDIRECT_URL = 'https://etobarr.pythonanywhere.com/callback'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/hello/<name>')
def hello(name):
    return 'Hello, {}!'.format(name)

@app.route('/message', methods=['GET', 'POST'])
def message():
    if request.method == 'POST':
        content = request.form['content']
        with sqlite3.connect('working/token.db') as conn:
            c = conn.cursor()
            c.execute("INSERT INTO messages (content) VALUES (?)", (content,))
            conn.commit()
        return redirect(url_for('index'))
    return render_template('message.html')

@app.route('/login')
def login():
    params = {
        'client_id': STRAVA_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URL,
        'scope': 'read,activity:read',
        'approval_prompt': 'force'
    }
    url = requests.Request('GET', STRAVA_AUTH_BASE_URL, params=params).prepare().url
    return redirect(url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    data = {
        'client_id': STRAVA_CLIENT_ID,
        'client_secret': STRAVA_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    }
    response = requests.post(STRAVA_TOKEN_URL, data=data)
    access_token = response.json().get('access_token')

    # Replace this with the actual user ID or a method to identify the user
    user_id = 1  

    with sqlite3.connect('/home/etobarr/myproject/apps/strava_api_test/myproject/working') as conn:
        c = conn.cursor()
        # Update or insert the token
        c.execute("INSERT OR REPLACE INTO strava_tokens (user_id, access_token) VALUES (?, ?)", (user_id, access_token))
        conn.commit()

    logging.debug('You have been successfully logged in with Strava!')

    return 'You have been successfully logged in with Strava!'

if __name__ == '__main__':
    init_db()  # Initialize the database

    # Configure logging to print messages to the console
    logging.basicConfig(level=logging.DEBUG)  # Set the logging level to DEBUG

    logging.debug('database initialized')

    app.run(debug=True)
