from flask import Flask, jsonify, request
import json
import pickle
import pandas as pd

app = Flask(__name__)
app.config.from_pyfile('config.py')

@app.route('/ping', methods=['GET', 'POST'])
def index():
    return jsonify({"message": "pong"})

@app.route('/bot', methods=['GET','POST'])
def bot():
    if request.method == "POST":
        obj = json.loads(request.data)
        df = pd.DataFrame.from_dict([obj])
        output = model.predict(df)
        if(output == 1):
            Prediction = "Bot Account"
        elif output == 0:
            Prediction = "Human"
    return jsonify({"Prediction": Prediction})

if __name__ == '__main__':
    with open('model_pkl', 'rb') as f:
        model = pickle.load(f)
    app.run(debug=True)