from flask import Flask, jsonify, request, make_response
import json
import pickle
import pandas as pd
import requests
import os
from dotenv import load_dotenv
import tweepy

app = Flask(__name__)
app.config.from_pyfile('config.py')

load_dotenv()
consumer_key = os.getenv('consumer_key')
consumer_secret = os.getenv('consumer_secret')
access_token = os.getenv('access_token')
access_token_secret = os.getenv('access_token_secret')
bearer_token = os.getenv('bearer_token')

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/ping', methods=['GET'])
def index():
    return jsonify({"message": "pong"})

@app.route('/twt-bot', methods=['POST'])
def twtbot():
    if request.method == "POST":
        obj = json.loads(request.data)
        print(obj)
        df = pd.DataFrame.from_dict([obj])
        output = twt_model.predict(df)
        if(output == 1):
            Prediction = "Bot Account"
        elif output == 0:
            Prediction = "Human"
        print(Prediction)
        return _corsify_actual_response(jsonify({"Prediction": Prediction}))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()


@app.route('/ig-bot', methods=['POST','OPTIONS'])
def igbot():
    if request.method == "POST":
        obj = json.loads(request.data)
        print(obj)
        df = pd.DataFrame.from_dict([obj])
        output = ig_model.predict(df)
        if(output == 1):
            Prediction = "Bot Account"
        elif output == 0:
            Prediction = "Human"
        print(Prediction)
        return _corsify_actual_response(jsonify({"Prediction": Prediction}))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()


@app.route('/instagramUserData', methods=['GET', 'OPTIONS'])
def instagramUserData():
    if request.method == "GET":
        username = request.args.get("username")
        headers = {
            "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
            "x-asbd-id": "198387",
            "x-csrftoken": "VXLPx1sgRb8OCHg9c2NKXbfDndz913Yp",
            "x-ig-app-id": "936619743392459",
            "x-ig-www-claim": "0",
        }
        res = requests.get(
            f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}", headers=headers)
        # return (res.text)
        return _corsify_actual_response(jsonify({"response":res.text}))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()
    
@app.route('/twitterUserData', methods=['GET', 'OPTIONS'])
def twitterUserData():
    if request.method == "GET":
        username = request.args.get("username")
        auth = tweepy.OAuthHandler(consumer_key=consumer_key,
                           consumer_secret=consumer_secret)
        auth.set_access_token(access_token,
                            access_token_secret)
        api = tweepy.API(auth)

        # Client
        client = tweepy.Client(bearer_token, consumer_key=consumer_key, consumer_secret=consumer_secret,
                            access_token=access_token, access_token_secret=access_token_secret)

        # To get followers of a user
        def get_user(username):
            return api.get_user(screen_name=username, include_entities=False)
        # followers = []
        # for follower in tweepy.Cursor(api.get_followers, screen_name=user.screen_name).items(200):
        #     followers.append(follower)

        userDetails = get_user(username)._json
        return _corsify_actual_response(jsonify({"response":userDetails}))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()

# @app.route('/incorrectprediction', methods=['POST','OPTIONS'])
# def incPred():
#     if request.method == "POST":
#         obj = json.loads(request.data)
#         # print(obj)
#         x = obj["x"]
#         y = obj["y"]["fake"]
#         print(y)
#         dfx = pd.DataFrame.from_dict([x])
#         platform = obj["Platform"]
#         if(platform == "Instagram"):
#             ig_model.fit(dfx,y)
#             with open('insta_model_pkl', 'wb') as files:
#                 pickle.dump(ig_model, files)
#         elif(platform == "Twitter"):
#             twt_model.fit(dfx,y)
#             with open('model_pkl', 'wb') as files:
#                 pickle.dump(twt_model, files)
#         return _corsify_actual_response(jsonify({"Result": "Model Has been fit"}))
#     elif request.method == "OPTIONS":
#         return _build_cors_preflight_response()  


if __name__ == '__main__':
    with open('model_pkl', 'rb') as f:
        twt_model = pickle.load(f)
    with open('insta_model_pkl', 'rb') as i:
        ig_model = pickle.load(i)
    
    app.run(debug=True, port=3000)