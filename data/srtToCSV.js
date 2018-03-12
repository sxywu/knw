const fs = require('fs');
const parser = require('subtitles-parser');
const json2csv = require('json2csv').parse;

const srt = fs.readFileSync('./data/japanese_sub.srt', 'utf8');
let data = parser.fromSrt(srt);
data = data.slice(1).slice(0, data.length - 3);

const csv = json2csv(data);
fs.writeFileSync('./data/japanese_sub.csv', csv);
