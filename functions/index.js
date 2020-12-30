const functions = require('firebase-functions');
var express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
var cors = require('cors')
var timeout = require('connect-timeout')
var app = express()


app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res, next) {
    res.send("Welcome to Beautify & Minify JSON Cros")
})

app.post('/process', (req, res) => {
    var json = req.body.data;
    showResult(json, json, res);
})

function isUrl(str) {
    try {
        return (str.startsWith("https://") && str.includes("https://")) ||
            (str.startsWith("http://") && str.includes("http://"));
    } catch (error) {
        return false;
    }
}

function showResult(requestData, json, res) {
    if (isUrl(json)) {
        res.status(200).send({ type: isUrl(json), isDownload: false, requestData: requestData, response: requestData });
    } else {
        if (isJSON(json)) {
            var beautiFiedjson = JSON.stringify(JSON.parse(json), null, 4);
            res.status(200).send({ type: isUrl(json), isDownload: true, requestData: requestData, response: beautiFiedjson });
            downloadFile(beautiFiedjson);
        } else {
            res.status(200).send({ type: isUrl(json), isDownload: false,requestData: requestData, response: isJSON(json) + " Invalid JSON..." });
        }
    }
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function downloadFile(str) {
    var outputjson = "output.json"
    fs.writeFileSync(outputjson, str);
}

app.get('/getDownloadFile', (req, res) => {
    res.download('./output.json');
})

app.listen(3001, function () {
    console.log('CORS-enabled web server listening on port 3001')
})

exports.app = functions.https.onRequest(app);