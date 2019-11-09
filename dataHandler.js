const mongo = require('mongodb').MongoClient
const url = 'mongodb+srv://orm:chikita10@cluster0-au3im.mongodb.net/test?retryWrites=true&w=majority' //in real life this would be encoded
const connectionObj = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
module.exports.lookUp = (word, callback) => {
    mongo.connect(url, connectionObj, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
        const db = client.db('wordCounter')
        const collection = db.collection('words');
        collection.findOne({}, (err, item) =>{
            if (err) console.log(err)
            else if (item){
                callback(item[word]) 
            }
        })
        
    })
}
module.exports.dropDocument = (callback) =>{
    mongo.connect(url, connectionObj, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
        const db = client.db('wordCounter')
        const collection = db.collection('words');
        collection.findOneAndDelete({}, (err, item) =>{
            if (err) console.log(err)
            if (item.value != null) {
                console.log('document deleted!')
                callback()
            } else {
                console.log('DB is already empty!')
                callback()
            }
        })
    })
}
module.exports.storeData = (data, callback) => {
    mongo.connect(url, connectionObj, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
        const db = client.db('wordCounter')
        const collection = db.collection('words');
        insertData(data, collection, () => {
            callback()
        })
        
    })
}

buildJson = (data, callback) =>{
    let resultObj = {}
    let newCount
    for (var i = 0; i < data.length; i++){
        if (resultObj[data[i]]){
            newCount = resultObj[data[i]] + 1
        } else {
            newCount = 1    
        }
        
        resultObj[data[i]] = newCount
    }
    callback(resultObj)
}
insertData = (data, collection, callback) =>{
    const dataArray = data.split(' ')
    buildJson(dataArray, (result) =>{
        collection.findOneAndUpdate({}, {$inc: result}, {upsert: true} ,(err, item) => {
            if (err) console.log(err)
            console.log("DB updated successfully!")
            callback()
        })
    })
}