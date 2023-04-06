import tweepy
import math
from datetime import datetime
from dateutil.parser import parse
from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()
consumer_key = os.getenv('consumer_key')
consumer_secret = os.getenv('consumer_secret')
access_token = os.getenv('access_token')
access_token_secret = os.getenv('access_token_secret')
bearer_token = os.getenv('bearer_token')

def getInstagramUserData(username):
    url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"

    payload={}
    headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
    'x-asbd-id': '198387',
    'x-csrftoken': 'XLPx1sgRb8OCHg9c2NKXbfDndz913Yp',
    'x-ig-app-id': '936619743392459',
    'x-ig-www-claim': '0',
    'Cookie': 'csrftoken=2O2lTdAEChP9M4HebjdRsO6sH0L2aleB; ig_did=6AAAA919-A0BA-4322-80A6-43BB67EC3939; ig_nrcb=1; mid=ZAdiDwAEAAGcjuHJXikvLXdN3fJa'
    }

    res = requests.request("GET", url, headers=headers, data=payload)

    respDict = json.loads(res.text)
    userData = respDict['data']['user']
    pfpUrl = userData['profile_pic_url']
    pfp = 0 if "44884218_345707102882519_2446069589734326272_n.jpg" in pfpUrl else 1
    fullName = userData["full_name"]
    bio = userData["biography"]
    externalURL = 0 if userData["external_url"] == "" else 1
    privacyStatus = 1 if userData["is_private"] else 0
    postCount = userData["edge_owner_to_timeline_media"]['count']
    followers = userData["edge_followed_by"]['count']
    following = userData["edge_follow"]['count']
    fullNameTokens = len(fullName.split(" "))
    numUsername = sum(1 for x in username if x.isdigit())
    numRatioUsername = 0 if numUsername == 0 else (len(username) - numUsername) / numUsername
    numFullname =  sum(1 for x in fullName if x.isdigit())
    numRatioFullname = 0 if numFullname == 0 else (len(fullName) - numFullname) / numFullname
    bioLen = len(bio)
    nameUsername = 1 if username.lower() == fullName.lower() else 0
    userData = {
        "fullname":fullName,
        "userData":{
      "profile pic": pfp,
      "nums/length username": numRatioUsername,
      "fullname words": fullNameTokens,
      "nums/length fullname": numRatioFullname,
      "name==username": nameUsername,
      "description length": bioLen,
      "external URL": externalURL,
      "private": privacyStatus,
      "#posts": postCount,
      "#followers": followers,
      "#follows": following,
    }}
    return userData


def getTwitterUserData(username):
    auth = tweepy.OAuthHandler(consumer_key=consumer_key,
                        consumer_secret=consumer_secret)
    auth.set_access_token(access_token,
                        access_token_secret)
    api = tweepy.API(auth)
    client = tweepy.Client(bearer_token, consumer_key=consumer_key, consumer_secret=consumer_secret,
                        access_token=access_token, access_token_secret=access_token_secret)
    def get_user(username):
        return api.get_user(screen_name=username, include_entities=False)
    userData = get_user(username)._json
    # print(userData)
    created_at = datetime.timestamp(parse(userData["created_at"]))
    today = datetime.timestamp(datetime.now())
    difference = (today-created_at)/86400
    days = math.ceil(difference)
    avg_twts = round(int(userData["statuses_count"])/days,2)
    finalData = {
    "fullname":userData['name'],
    "userData": {
    "default_profile": userData["default_profile"],
    "default_profile_image": userData["default_profile_image"],
    "favourites_count": userData["favourites_count"],
    "followers_count" :userData["followers_count"],
    "friends_count": userData["friends_count"],
    "geo_enabled": userData["geo_enabled"],
    "lang": 9,
    "statuses_count" : userData["statuses_count"],
    "verified": userData["verified"],
    "average_tweets_per_day" : avg_twts,
    "account_age_days": days
    }}


    return finalData



def getUserData(platform, username):
    print(platform,username)
    if(platform == "instagram"):
        userData = getInstagramUserData(username)
    elif(platform =="twitter"):
        userData = getTwitterUserData(username)
    return userData