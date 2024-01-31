# Import libraries
import numpy as np
import json
from keras.models import load_model

# Load cat breed model
cats_breeds_model = load_model('./classification_models/Cats_Breeds.h5')

# JSON file
cats_breeds_names = open ('./json_data/cat_he.json', "r", encoding='utf-8')

# Reading from file
cats_breeds_names = json.loads(cats_breeds_names.read())

label_maps_cats = {}
label_maps_rev_cats = {}
for i, v in enumerate(cats_breeds_names):
    label_maps_cats.update({v: i})
    label_maps_rev_cats.update({i : v})
    
class cats_breeds :
    
    def cats_breeds_classifier(test_image):
        probs = cats_breeds_model.predict(np.expand_dims(test_image, axis=0))
        breeds = ""
        for idx in probs.argsort()[0][::-1][:5]:
            # print("{:.2f}%".format(probs[0][idx]*100), "\t", label_maps_rev_cats[idx].split("-")[-1])
            percent = probs[0][idx]*100
            if(percent > 2):
                breeds+=f'{label_maps_rev_cats[idx].split("-")[-1]} ({"{:.2f}%".format(probs[0][idx]*100)})\n'
        # plt.show()    
        return breeds