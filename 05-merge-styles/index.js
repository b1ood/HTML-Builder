const path = require('node:path');
const fs = require('node:fs');
const stylesSource = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesSource, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);

  const writeableStream = fs.createWriteStream(bundlePath);

  files.forEach((file) => {
    const fileSource = path.join(stylesSource, file.name);
    const fileExt = path.extname(fileSource);
    if (fileExt === '.css') {
      const readableStream = fs.createReadStream(fileSource);

      readableStream.on('data', (chunk) => {
        writeableStream.write(chunk);
      });
    }
  });
});
