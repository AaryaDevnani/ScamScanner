from flask import Flask, jsonify, request, make_response
import pickle
import pandas as pd
import getUserData


app = Flask(__name__)
app.config.from_pyfile('config.py')



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

@app.route('/bot', methods=['GET','OPTIONS'])
def twtbot():
    if request.method == "GET":
        platform = request.args.get("platform")
        print(platform)
        username = request.args.get("username")
        res = getUserData.getUserData(platform,username)
        df = pd.DataFrame.from_dict([res["userData"]])
        output = ""
        if(platform == "twitter"):
            output = twt_model.predict(df)
        elif(platform =="instagram"):
            output =  ig_model.predict(df)
        if(output == 1):
            Prediction = "Bot Account"
        elif output == 0:
            Prediction = "Human"
        
        finalOutput = {
            "Prediction": Prediction,
            "userData":res["userData"],
            "username":username,
            "fullname":res["fullname"],
            "platform":platform
        }
        print(finalOutput)
        return _corsify_actual_response(jsonify(finalOutput))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()


if __name__ == '__main__':
    with open('twitter_model_pkl', 'rb') as f:
        twt_model = pickle.load(f)
    with open('insta_model_pkl', 'rb') as i:
        ig_model = pickle.load(i)
    
    app.run(debug=True, port=3000)