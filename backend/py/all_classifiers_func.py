# Import our modules
from base_classifier import base_classifier
from dogs_breeds import dogs_breeds
from cats_breeds import cats_breeds
from Pet import Pet
# Import library from keras
from keras_preprocessing.image import load_img

class all_classifiers :

    def pet_details(file_name):
        test_image = load_img(file_name, target_size=(224, 224))
        pet_type = base_classifier.dogs_cats_classifier(test_image)
        if pet_type == "dog":
            breeds = dogs_breeds.dogs_breeds_classifier(test_image)
        else: 
            breeds = cats_breeds.cats_breeds_classifier(test_image)
        p_instance = Pet(pet_type, breeds)
        print(f"pet type: {p_instance.pet_type}\nbreeds: {p_instance.breeds}")
        return p_instance

    # pet_details(r"C:\Users\USER\dog_cat_images\dogs\nico.jpg")