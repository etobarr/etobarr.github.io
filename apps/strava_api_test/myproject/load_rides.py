import pandas as pd
import requests

def filter_to_cycling_with_stream_data(activity_df: pd.DataFrame) -> pd.DataFrame:
    """
    Filters a dataframe of strava activities to only include cycling activities which contain power and/or heart rate data. 
    Returns a new dataframe.
    """
    df = activity_df[(activity_df['type'].isin(['Ride', 'VirtualRide']))].copy() # cycling activities only

    # clean up boolean power data column
    df['device_watts'] = pd.to_numeric(df['device_watts'], errors='coerce')
    df['device_watts'].fillna(False, inplace=True)
    df['device_watts'] = df['device_watts'].astype(bool)

    # clean up boolean heart rate data column
    df['has_heartrate'] = pd.to_numeric(df['has_heartrate'], errors='coerce')
    df['has_heartrate'].fillna(False, inplace=True)
    df['has_heartrate'] = df['has_heartrate'].astype(bool)
    
    # apply filter
    df = df[df['device_watts'] | df['has_heartrate']].copy()
    return df

def get_new_rides(access_token:str) -> pd.DataFrame:
    """
    Fetches new rides from Strava using user's url and access token.
    """
    activities_url = "https://www.strava.com/api/v3/athlete/activities" # activities url mask
    header = {'Authorization': 'Bearer ' + access_token}

    request_page_num = 1
    activities_byPage = []
    print('retrieving activity data...')
    
    while True:
        # fetches data from api; limited to 200 activities per request -- must retrieve by page
        param = {'per_page': 200, 'page': request_page_num}
        page_data = []
        page_data = requests.get(activities_url, headers=header, params=param).json()

        if type(page_data) == dict: # page_data is a dict if the api limit has been exceeded
            # break loop and alert user
            print('Error: rate limit exceeded')
            break
        if len(page_data) == 0: # check to make sure the list is not empty
            # break loop and alert user
            print("retrieved all activities :)")
            break
        else:
            # build list of activities from pages
            activities_byPage.append(page_data)
            print('retrieved ' + str(len(page_data)) + ' activities from page ' + str(request_page_num))
        request_page_num += 1

    if ((type(page_data) == dict) & (len(activities_byPage) == 0)): # checks if page_data is a dict and there are no new activities to append
            print('exiting...')
    
    all_activities = [item for sublist in activities_byPage for item in sublist] # un-nests activities from pages
    all_activities_df = pd.DataFrame(all_activities) # converts list to df
    all_rides_df = filter_to_cycling_with_stream_data(all_activities_df) # filters to cycling activities with stream data

    try: # append only new activities so as not to overwrite existing data
        existing_rides_df = pd.read_json(file_name, orient='records') # retrieves existing data from local file
        new_ride_ids = list(set(all_rides_df['id'].values) - set(existing_rides_df['id'].values)) # retrieves IDs from new rides
        new_rides_df = all_rides_df[all_rides_df['id'].isin(new_ride_ids)] # creates df of new rides
        ride_df = pd.concat([new_rides_df, existing_rides_df]) # appends new and existing rides
        print(str(len(new_rides_df)) + ' new rides appended \n')
    except FileNotFoundError:
        ride_df = all_rides_df.copy() # saves all loaded rides to new local file
        print('could not find existing file - new file created')
        print(str(len(ride_df)) + ' rides saved \n')
    return ride_df

def get_new_rides_stream_data(access_token:str, input_df:pd.DataFrame) -> pd.DataFrame:
    """
    Gets details for power, heart rate, cadence and time data for each ride.
    """
    header = {'Authorization': 'Bearer ' + access_token}
    
    ride_df = input_df
    metrics = ['watts', 'cadence', 'heartrate', 'time']
    for metric in metrics: # adds metric column to the ride_df if it doesn't already exist
        if f'{metric}Stream' not in ride_df.columns:
            ride_df[f'{metric}Stream'] = None
            print(f'added {metric}Stream column')

    count = 0
    stream_data = []
    print('retrieving stream data...')
    for i, row in ride_df.iterrows(): # iterate over rows of ride_df
        for metric in metrics: # iterate over stream columns (by row)
            if ride_df.at[i, f'{metric}Stream'] == None: # checks if cell is empty

                stream_params = {'keys': {metric}, 'key_by_type': 'true'} # define parameters for request

                # request stream data
                stream_url = f"https://www.strava.com/api/v3/activities/{row['id']}/streams"
                stream_data = requests.get(stream_url, headers=header, params=stream_params).json()
                print(stream_data)
                if stream_data.get('message', 'OK') == 'Rate Limit Exceeded':
                    print('Error: rate limit exceeded')
                    break
                if stream_data == []:
                    print('empty list, skipping')
                    ride_df.at[i, f'{metric}Stream'] = 'n/a'
                    continue
                # assign power data to the appropriate ride in the DataFrame
                try:
                    ride_df.at[i, f'{metric}Stream'] = stream_data[f'{metric}']['data']
                    count += 1
                except KeyError:
                    ride_df.at[i, f'{metric}Stream'] = 'n/a'
            else: continue # skip cells with data
        if type(stream_data) == dict:
            if stream_data.get('message', 'OK') == 'Rate Limit Exceeded':
                print('exiting...')
                break

    if count > 0:
        print(str(count) + ' cells updated with stream data :)')
        return input_df
    else:
        print('no new data to retrieve')
        return None