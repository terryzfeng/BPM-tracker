import pickle
import flask
import os

app = flask.Flask(__name__)
port = int(os.getenv("PORT", 9099))

filename = "BeatNet_Model.ml"

model = pickle.load(open(filename, "rb"))


@app.route('/analyze', methods=['POST'])
def predict():

    features = flask.request.get_json(force=True)['features']
    prediction = model.predict([features])[0, 0]
    response = {'prediction': prediction}

    return flask.jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
