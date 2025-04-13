import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import os
import pymongo
import json
import bson.json_util as json_util
from io import BytesIO
from PIL import Image
from scipy.spatial import distance
from bson.json_util import dumps
from dotenv import load_dotenv
load_dotenv()

# connection URL and database name
url = os.getenv("URL")
db_name = os.getenv("DB_NAME")

# connect to the database
client = pymongo.MongoClient(url)
db = client[db_name]

# get a reference to the collection
collection = db['newpets']


model_url = "https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2"

def init_model():
    global layer, model
    layer = hub.KerasLayer(model_url, trainable=False)  # Load and freeze weights
    model = tf.keras.Sequential([layer])


IMAGE_SHAPE = (224, 224)

init_model()  # Load the model at the beginning

class imageSimilarityClass : 
        def imagePreprocessing(self, file):
                # Resizing to the size the model was trained on
                file = Image.open(file).convert('L').resize(IMAGE_SHAPE)
                # Converting the image into a color representation for each pixel
                file = np.stack((file,)*3, axis=-1)
                # Normalizing the values between 0 and 1
                file = np.array(file)/255.0

                embedding = model.predict(file[np.newaxis, ...])
                vgg16_feature_np = np.array(embedding)
                flattended_feature = vgg16_feature_np.flatten()

                return flattended_feature

        def imageSimilarity(self, petType, docID, status):
                metric = 'cosine'
                pets_dir = "/backend-app/pets" if os.getenv("DOCKER_ENV") == "true" else "pets"
                dir_list = os.listdir(pets_dir)
                if not dir_list:
                        print("No images found in the pets directory.")
                        return json.dumps({"error": "No images found"})

                test_image_address = os.path.join(pets_dir, dir_list[0])
                test_image = self.imagePreprocessing(test_image_address)
                print(status)
                if(status == "found"):
                        status = "lost"
                else: 
                        status = "found"
                
                filter = {'petType': petType, "status": status}
                # get a cursor to iterate over the documents in the collection
                documents = list(collection.find(filter))
                print(len(documents))
                #cursor = collection.find(filter)
                matching_docs_ids = []
                # iterate over the documents and process one image at a time
                for doc in documents:
                        # get the image buffer from the document
                        if str(doc["_id"]) == docID:
                                continue
                        image_buffer = doc['img']['data']
                        matching_image = self.imagePreprocessing(BytesIO(image_buffer))
                        dc = distance.cdist([test_image], [matching_image], metric)[0]
                        result = dc[0]      
                        if(result < 0.4): 
                                matching_docs_ids.append(str(doc["_id"])) 
                                print(doc["_id"])
                        print(result)              
                               
                result_json = dumps(matching_docs_ids)
                print(result_json)
                return result_json     


                
                
                
                
                
                
                