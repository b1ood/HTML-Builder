const fs = require('node:fs');
const path = require('node:path');

const writeStream = fs.createWriteStream(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
);

process.on('exit', () => process.stdout.write('Good luck in the future!'));
process.on('SIGINT', () => process.exit());

process.stdout.write('Hi, lets try to study Node together :) \n');
process.stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) process.exit();
  writeStream.write(chunk);
});
