const path = require('node:path');
const fsPromises = require('node:fs/promises');
const projFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.rm(copiedFolder, { force: true, recursive: true });
    await fsPromises.mkdir(copiedFolder);
    const files = await fsPromises.readdir(
      projFolder,
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        return files;
      },
    );
    files.forEach((file) => {
      const fileSource = path.join(projFolder, file.name);
      const fileDuplicate = path.join(copiedFolder, file.name);
      fsPromises.copyFile(fileSource, fileDuplicate);
    });
  } catch (err) {
    console.log(err);
  }
}

copyDir();
