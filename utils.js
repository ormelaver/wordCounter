const fs = require('fs');
const validUrl = require('valid-url')
const request = require('request');
const textHandler = require('./textHandler');
const dataHandler = require('./dataHandler');
const allowedTypes = {'-f':1, '-s':1, '-u':1, '-drop':1};

isServerAlive = (inputUrl, callback) => {

    let isAlive = false;
    request(inputUrl, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 202)) {
            isAlive = true;
            callback(isAlive)
        }
    })
}

module.exports.initDataFlow  = (type, data, callback) => {
    let cleanData
    switch (type) {
        case '-s':
            cleanData = textHandler.cleanData(data);
            dataHandler.storeData(cleanData, () =>{
                callback()
            })
            break
        case '-f':
            fs.readFile(data, 'utf8', function(err, contents) {
                cleanData = textHandler.cleanData(contents)
                dataHandler.storeData(cleanData, () =>{
                    callback()
                })
            })
            break
        case '-u':
            request(data, (err, res, body) => {
                if (err) return console.log(err)
                cleanData = textHandler.cleanDataUrl(body)
                dataHandler.storeData(cleanData, () =>{
                    callback()
                })
            });
            break
        case '-drop':
            dataHandler.dropDocument(() =>{
                callback()
            })
    }
}
module.exports.validateInput = (type, arg) => {
    let successObj = {'err' : '', 'success': true}
    try {
        if (!allowedTypes[type]){
            successObj['err'] = 'invalid type'
            successObj['success'] = false
        } else if (type == '-f'){  
            if (!fs.existsSync(arg)){
                successObj['err'] = 'file does not exist'
                successObj['success'] = false
            }
        } else if (type == '-s'){
            if (arg == ''){
                successObj['err'] = 'string must not be empty'
                successObj['success'] = false
            }
        } else if (type == '-u'){
            if (!validUrl.isUri(arg)){
                successObj['err'] = 'url is not valid'
                successObj['success'] = false
            } else {
                isServerAlive(arg, (isAlive) =>{
                    if (!isAlive){
                        successObj['err'] = 'url is not valid'
                        successObj['success'] = false
                    }
                })
            }  
        } else if (type == '-drop'){
            if (arg){
                successObj['err'] = 'drop does not accept parameters'
                successObj['success'] = false
            }
        }
    } catch (err){
        console.log(err)
    }
    return successObj;
}

