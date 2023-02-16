from flask import Flask, jsonify, request
import json
import pickle
import pandas as pd

app = Flask(__name__)
app.config.from_pyfile('config.py')

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

@app.route('/ig-bot', methods=['POST'])
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
    return jsonify({"Prediction": Prediction})

if __name__ == '__main__':
    with open('model_pkl', 'rb') as f:
        twt_model = pickle.load(f)
    with open('insta_model_pkl', 'rb') as i:
        ig_model = pickle.load(i)
    
    app.run(debug=True, port=3000)