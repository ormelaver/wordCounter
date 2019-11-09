
const jsdom = require("jsdom");

module.exports.cleanData = (data) =>{
    let toLowerCase = data.toLowerCase()
    let dataRemoveDotsAndCommas = toLowerCase.replace(/(,|\.|-|;|:|!|'s)/g, ' ') //remove punctuation marks with possible no space after them (and insert space so words won't get appended together)
    let dataNoExSpaces = dataRemoveDotsAndCommas.replace(/\s+/g,' ').trim() //remove extra spaces
    let dataRemovePunc = dataNoExSpaces.replace(/(~|`|@|[0-9]|#|\$|%|\^|&|\*|\(|\)|{|}|\[|\]|\"|'|<|>|\?|\/|\\|_|\+|=|‘|’|©)/g,"")
    return dataRemovePunc.replace(/\s+/g,' ').trim()
}

module.exports.cleanDataUrl = (data) =>{
    const {JSDOM} = jsdom;
    const dom = new JSDOM(data);
    const $ = (require('jquery'))(dom.window);
    $('script').remove()
    $('noscript').remove()
    $('style').remove()
    $('span').append(' ').text()
    $('a').append(' ').text()
    let toLowerCase = $('body').text().toLowerCase()
    let parsedBody = toLowerCase.replace(/(,|\.|-|;|:|!|'s)/g, ' ')
    let removePuncs =  parsedBody.replace(/(~|`|@|[0-9]|#|\$|%|\^|&|\*|\(|\)|{|}|\[|\]|\"|'|<|>|\?|\/|\\|_|\+|=|‘|’|©)/g,"")
    return removePuncs.replace(/\s+/g,' ').trim()
}
