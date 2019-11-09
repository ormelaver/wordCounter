const utils = require('./utils');

const type = process.argv[2]
const arg = process.argv[3]
if (process.argv.length != 4){
    console.log('please insert exactly 2 parameters of the form [type] [argument]')
    process.exit()
}
const isInputValid = utils.validateInput(type, arg)
if (!isInputValid.success){
    console.log(isInputValid.err)
    process.exit()
}
utils.initDataFlow(type, arg, () =>{
    process.exit()
})