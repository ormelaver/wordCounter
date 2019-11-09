const dataHandler = require('./dataHandler')

if (process.argv.length != 3){
    console.log('please insert exactly one word')
    process.exit()
}

dataHandler.lookUp(process.argv[2], (result) =>{
    if (result){
        console.log('your word has ' + result + ' occurences')
    } else {
        console.log('your word has no occurences')
    }
    process.exit()
})