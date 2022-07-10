import pickle
import flask
import os

import utils

app = flask.Flask(__name__)
port = int(os.getenv("PORT", 9099))

model_path = "BeatNet_Model.ml"
audio_name= "audio.wav"

model = pickle.load(open(model_path, "rb"))


@app.route('/bpm', methods=['POST'])
def bpm():
    if flask.request.method == "POST":
        file = flask.request.files['file']
        print(file)

        if file:
            file.save(os.path.join(app.root_path, audio_name))
        
        output = model.process(audio_name)
        print(output)

        response = {"data": utils.npArrToList(output)}
        return flask.jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
