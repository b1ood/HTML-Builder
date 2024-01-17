const path = require('node:path');
const fs = require('node:fs');
const textPath = path.join(__dirname, 'text.txt');

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    }),
  );
};

readFileAsync(textPath).then((data) => console.log(data));
