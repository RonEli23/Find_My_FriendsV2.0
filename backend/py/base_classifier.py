# Import libraries
import numpy as np
from keras.models import load_model

# Load Dogs_vs_Cats model
model = load_model('./classification_models/Dogs&Cats.h5')

class base_classifier :

    def dogs_cats_classifier(test_image):
        # plt.show()
        probs = model.predict(np.expand_dims(test_image, axis=0))
        # plt.imshow(test_image)
        if probs[0] < 0:
            return "cat"
        else:
            return "dog"