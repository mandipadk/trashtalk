from flask import Flask, request
import os
import base64
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)


@app.route('/process_image', methods=['POST'])
def process_image():
    image_data = request.get_json()['imageData']
    print("-----------------------------------------")
    print(image_data)
    print("-----------------------------------------")

    if isinstance(image_data, str):
        image_data_split = image_data.split('base64,')[1]
        print("-----------------------------------------")
        print(image_data_split)
        print("-----------------------------------------")
        decoded_image_data = base64.b64decode(image_data_split)
        image = Image.open(BytesIO(decoded_image_data))
    else:
        image = Image.open(BytesIO(image_data))

    # Check if the directory exists, if not, create it
    if not os.path.exists('/uploads'):
        os.makedirs('/uploads')

    image.save(os.path.join('/uploads', 'image.jpg'))

    return {"message": "Image processed successfully"}

if __name__ == "__main__":
    app.run(debug=True, port=4000)

