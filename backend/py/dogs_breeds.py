# Import libraries
import numpy as np
import json
from keras.models import load_model

# Load dog breed model
dogs_breeds_model = load_model('./classification_models/Dogs_Breeds.h5')

# JSON file
dogs_breeds_names = open ('./json_data/dog_he.json', "r", encoding='utf-8')

# Reading from file
dogs_breeds_names = json.loads(dogs_breeds_names.read())

label_maps_dogs = {}
label_maps_rev_dogs = {}
for i, v in enumerate(dogs_breeds_names):
    label_maps_dogs.update({v: i})
    label_maps_rev_dogs.update({i : v})

class dogs_breeds :
    def dogs_breeds_classifier(test_image):
        probs = dogs_breeds_model.predict(np.expand_dims(test_image, axis=0))
        breeds = ""
        for idx in probs.argsort()[0][::-1][:5]:
            # print("{:.2f}%".format(probs[0][idx]*100), "\t", label_maps_rev_dogs[idx].split("-")[-1])
            percent = probs[0][idx]*100
            if(percent > 2):
                breeds+=f'{label_maps_rev_dogs[idx].split("-")[-1]} ({"{:.2f}%".format(probs[0][idx]*100)})\n'
        # plt.show()    
        return breeds

