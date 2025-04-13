# Import libraries
from flask import Flask, request
import json
import os
import logging  

# Import our modules
from all_classifiers_func import all_classifiers
from Pet import Pet
from imageSimilarity import imageSimilarityClass

# Check if running in Docker
isDocker = os.getenv("DOCKER_ENV") == "true"

# Initialize Flask app
app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/flask/pets_details', methods=['GET'])
def pets_details():
    args = request.args
    name = args.get("name", default="", type=str)

    # Use different paths for Docker vs. Local
    test_image = f"/backend-app/pets/{name}" if isDocker else f"pets/{name}"

    if not os.path.exists(test_image):
        logger.error(f"File not found: {test_image}")
        return "File not found", 404

    p = all_classifiers.pet_details(test_image)
    pet = Pet(p.pet_type, p.breeds)
    # convert into JSON:
    pet_json = json.dumps(pet.__dict__) #you must add __dict__ in order to parse the object into json format
    return pet_json

@app.route('/flask/imageSimilarity', methods=['GET'])
def imageSimilarity():
    args = request.args
    petType = args.get("petType", default="", type=str)
    docID = args.get("docID", default="", type=str)
    status = args.get("status", default="", type=str)
    #To use the class, we need to create an instance, like so:
    similarPet = imageSimilarityClass()
    result = similarPet.imageSimilarity(petType, docID, status)
    return result
    
if __name__ == "__main__":
    port = 5000
    logger.info(f"🚀 Flask server is starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)