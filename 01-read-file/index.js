const path = require('node:path');
const fs = require('node:fs');
const textPath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(textPath, { encoding: 'utf-8' });

readableStream.on('data', (chunk) => process.stdout.write(chunk));
