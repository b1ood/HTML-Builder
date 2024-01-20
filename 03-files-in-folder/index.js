const fs = require('node:fs');
const path = require('node:path');
const dirPath = path.resolve(__dirname, 'secret-folder');

function readFileParams(fileName, fileExt, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err) console.log(err.message);
    console.log(
      `${fileName} - ${!fileExt ? 'N/A' : fileExt} - ${stats.size / 1000}kB`,
    );
  });
}

function reader(folderPath) {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      if (file.isDirectory()) {
        return reader(path.resolve(dirPath, file.name));
      }
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileExt = path.extname(filePath).slice(1);
        const fileName = file.name;
        readFileParams(fileName, fileExt, filePath);
      }
    });
  });
}

reader(dirPath);
