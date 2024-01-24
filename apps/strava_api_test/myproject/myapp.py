from flask import Flask, render_template, request, url_for, redirect, session
import sqlite3
import requests

app = Flask(__name__)
app.secret_key = '!@#super_secret_key321456'

# Database setup
def init_db():
    with sqlite3.connect('/home/etobarr/myproject/apps/strava_api_test/myproject/working/token.db') as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS strava_tokens (user_id INTEGER PRIMARY KEY, access_token TEXT)''')
        conn.commit()
        print("Database initialized successfully")

# Strava OAuth Configuration
STRAVA_CLIENT_ID = '116573'
STRAVA_CLIENT_SECRET = 'f178359239fbb2c061697c8163a874471ca263de'
STRAVA_AUTH_BASE_URL = 'https://www.strava.com/oauth/authorize'
STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
REDIRECT_URL = 'https://etobarr.pythonanywhere.com/callback'

@app.route('/')
def index():
    print("Accessed index route")
    return render_template('index.html')

@app.route('/about')
def about():
    print("Accessed about route")
    return render_template('about.html')

@app.route('/hello/<name>')
def hello(name):
    print("Accessed hello route with name:", name)
    return 'Hello, {}!'.format(name)

@app.route('/message', methods=['GET', 'POST'])
def message():
    if request.method == 'POST':
        content = request.form['content']
        with sqlite3.connect('/home/etobarr/myproject/apps/strava_api_test/myproject/working/token.db') as conn:
            c = conn.cursor()
            c.execute("INSERT INTO messages (content) VALUES (?)", (content,))
            conn.commit()
            print("Message inserted into the database")
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
    print("Redirecting to Strava login URL:", url)
    return redirect(url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    print("Code received:", code)
    data = {
        'client_id': STRAVA_CLIENT_ID,
        'client_secret': STRAVA_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    }
    response = requests.post(STRAVA_TOKEN_URL, data=data)
    access_token = response.json().get('access_token')
    print("Access token received:", access_token)

    # Replace this with the actual user ID or a method to identify the user
    user_id = 1

    with sqlite3.connect('/home/etobarr/myproject/apps/strava_api_test/myproject/working/token.db') as conn:
        c = conn.cursor()
        # Update or insert the token
        c.execute("INSERT OR REPLACE INTO strava_tokens (user_id, access_token) VALUES (?, ?)", (user_id, access_token))
        conn.commit()
        print("Access token saved in the database")

    return 'You have been successfully logged in with Strava!'

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(debug=True)
