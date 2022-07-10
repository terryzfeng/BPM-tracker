import pickle
from BeatNet.BeatNet import BeatNet

filename = "BeatNet_Model.ml"

estimator = BeatNet(1, mode='offline', inference_model='DBN', plot=[], thread=False)

# Export BeatNet ML Model
#pickle.dump(estimator, open(filename,"wb"))

Output = estimator.process("./Teakwood.wav")

print(Output)