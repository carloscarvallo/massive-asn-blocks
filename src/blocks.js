const cheerio = require('cheerio'),
readline = require('readline'),
clc = require('cli-color');

module.exports = function(page, callback){
    var $ = cheerio.load(page), blocks = [], relatedASN = [];
    $('.table tr td a').each(function(i, elem){
        var text = $(this).text();
        if (i !== 0 && text !== ""){
            if (text.indexOf("AS") !== 0) {
                var p = text.indexOf("/");
                var red = text.substring(0, p);
                var cant = text.substring(p+1);
                blocks.push([red, cant]);
            } else {
                relatedASN.push(text);
            }
        }
    });
    callback(blocks);
};
