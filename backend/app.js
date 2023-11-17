const tf = require('@tensorflow/tfjs-node');
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
var cors = require('cors')
const path = require('path');

const mobilenet = require('@tensorflow-models/mobilenet')
// require('@tensorflow/tfjs-backend-cpu')
// require('@tensorflow/tfjs-backend-webgl')
// const img = document.getElementById('img');
const version = 2;
const alpha = 0.5;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.raw({ type: 'image/*', limit: '10mb' }));
app.use(cors())

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const port = 5000

function generateUniqueFilename() {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); // Convert timestamp to a string without special characters
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const fileExtension = '.png'; // Get the original file extension
    const folderPath = path.join(__dirname, 'uploads');
    return path.join(folderPath, `${timestamp}_${randomString}${fileExtension}`);
  }

app.get('/', cors(corsOptions), function (req, res, next){
 res.send("The backend is up!")
});

app.get('/get-data', cors(corsOptions), (req, res)=>{
    res.json({message: "server ready to receive requests"})
})


//this works
app.post('/upload', cors(corsOptions), async (req, res) => {
    const imageData = req.body.data;
    // console.log(imageData)
    const buffer = Buffer.from(imageData.split('base64,')[1], 'base64');
    // console.log(buffer);
    if (!buffer) {
        return res.json({ message: "No image data received." });
    }
    
    try {
        axios.post('https://rnhno-34-31-20-209.a.free.pinggy.online/process_image', {
            headers: {
                'Content-Type': 'application/json',
            },
            imageData
        })
          .then(function (response) {
            console.log(response.data.predictions, response.data.confidence);
            res.json({ Prediction: response.data.predictions, Confidence: response.data.confidence});
          })
          .catch(function (error) {
            console.log(error);
            res.json({ message: error.message });
          });
        // const model = await mobilenet.load({version, alpha});
        // const imageTensor = tf.node.decodeImage(buffer);
        // const predictions = await model.classify(imageTensor);

        // console.log('Predictions');
        // console.log(predictions[0]);
        // const modelTwo = await tf.loadLayersModel('https://storage.googleapis.com/tensorflowmodeljs/js_model/model.json');
        // const tensor = tfnode.node.decodeImage(imageBuffer);
        // const imageTensor = tf.node.decodeImage(image, 3);  // Assuming the image is in RGB format
        // const preprocessedTensor = preprocessImage(imageTensor);
        // const predictions = model.predict(preprocessedTensor);
        // console.log(predictions);

        // const wasteCategory = getWasteCategory(predictions);
        // res.json({ category: wasteCategory });
    } catch (error) {
        console.log("Some error happened", error);
        res.json({ message: error.message });
    }
});

// app.post("/get-data", async (req, res) => {
//     console.log("-----------------Request Start------------------")
//     console.log(req.body)
//     // Assuming the image data is sent in the 'image' field
//     const image = req.body;

//     if (!image) {
//         return res.json({ message: "No image data received." });
//     }

//     try {
//         // Accessing filename from FormData field
//         const originalFilename = image.name;
//         console.log(originalFilename);

//         const model = await tf.loadLayersModel('https://storage.cloud.google.com/tensorflowmodeljs/js_model/model.json');
//         const imageTensor = tf.node.decodeImage(image, 3);  // Assuming the image is in RGB format
//         const preprocessedTensor = preprocessImage(imageTensor);
//         const predictions = model.predict(preprocessedTensor);
//         console.log(predictions);

//         const wasteCategory = getWasteCategory(predictions);
//         res.json({ category: wasteCategory });
//     } catch (error) {
//         console.log("Some error happened", error);
//         res.json({ message: error.message });
//     }
// });


// app.post("/get-data", cors(), async (req, res, next) => {
//     const imageData = req.body;
//     const originalFilename = req.get('Content-Disposition').split('filename=')[1]; // Extract original filename from request headers
//     const filename = generateUniqueFilename(originalFilename);
//     // const filename = `image_${Date.now()}.png`;

//     console.log("-----------------Request Start------------------")
//     console.log(req.body)
//     console.log("-----------------Request End------------------")
    
//     fs.writeFile(filename, imageData, 'binary', (err) => {
//     if (err) {
//             console.error(err);
//             res.status(500).send('Internal Server Error');
//         }
//     else{
//         try{
//         const model = await tf.loadLayersModel('https://storage.cloud.google.com/tensorflowmodeljs/js_model/model.json');
//         // const imageTensor = tf.browser.fromPixels(req.data);
//         const imageTensor = tf.browser.fromPixels('./cardboard.jpeg');
//         const preprocessedTensor = preprocessImage(imageTensor);
//         const predictions = model.predict(preprocessedTensor);
//         console.log(predictions)
//         const wasteCategory = getWasteCategory(predictions);
//         res.json({ category: wasteCategory });
//         }
//         catch(error){
//             console.log("Someerror happened", error)
//             res.json({message : error})
//         }

//     }
// })
// }
// )

app.post('/classify', (req, res) => {
    const wasteCategory = processWebcamData(req.body);
    res.json({ category: wasteCategory });
  });

app.listen(port, ()=> {
    console.log("The app is alive.")
})

function getWasteCategory(predictions) {
    const data = predictions.dataSync();
    const maxIndex = data.indexOf(Math.max(...data));
    return wasteCategoryNames[maxIndex];
   }