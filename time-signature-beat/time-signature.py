import pickle
from BeatNet.BeatNet import BeatNet

filename = "BeatNet_Model.ml"

estimator = BeatNet(1, mode='offline', inference_model='DBN', plot=[], thread=False)

#pickle.dump(estimator, open(filename,"wb"))

Output = estimator.process("https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav")

print(Output)