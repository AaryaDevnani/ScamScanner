from flask import Flask, jsonify, request, make_response
import json
import pickle
import pandas as pd

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
    return jsonify({"Prediction": Prediction})

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

@app.route('/incorrectprediction', methods=['POST','OPTIONS'])
def incPred():
    if request.method == "POST":
        obj = json.loads(request.data)
        # print(obj)
        x = obj["x"]
        y = obj["y"]["fake"]
        print(y)
        dfx = pd.DataFrame.from_dict([x])
        platform = obj["Platform"]
        if(platform == "Instagram"):
            ig_model.fit(dfx,y)
            with open('insta_model_pkl', 'wb') as files:
                pickle.dump(ig_model, files)
        elif(platform == "Twitter"):
            twt_model.fit(dfx,y)
            with open('model_pkl', 'wb') as files:
                pickle.dump(twt_model, files)
        return _corsify_actual_response(jsonify({"Result": "Model Has been fit"}))
    elif request.method == "OPTIONS":
        return _build_cors_preflight_response()  


if __name__ == '__main__':
    with open('model_pkl', 'rb') as f:
        twt_model = pickle.load(f)
    with open('insta_model_pkl', 'rb') as i:
        ig_model = pickle.load(i)
    
    app.run(debug=True, port=3000)