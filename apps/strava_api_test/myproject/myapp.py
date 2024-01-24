from flask import Flask, render_template, request, url_for, redirect, session
import sqlite3
import requests
import load_rides

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

    ride_df = load_rides.get_new_rides(access_token)
    df = load_rides.get_new_rides_stream_data(access_token, ride_df)
    last_ride_name = df['name'][len(df)]

    return render_template('dashboard.html', user_access_token=access_token, test_data = last_ride_name)

if __name__ == '__main__':
    init_db()  # Initialize the database
    app.run(debug=True)
