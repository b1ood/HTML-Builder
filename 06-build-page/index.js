const path = require('node:path');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const projFolder = 'project-dist';

async function createProjDist() {
  const distFolderPath = path.join(__dirname, projFolder);
  const assetsSource = path.join(__dirname, 'assets');
  const assetsFolder = path.join(__dirname, projFolder, 'assets');

  await fsPromises.mkdir(distFolderPath, { recursive: true });

  await mergeTemplates();
  await mergeStyles();
  await copyDir(assetsSource, assetsFolder);
}

async function mergeTemplates() {
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentFilesPath = path.join(__dirname, 'components');
  const HTMLFilePath = path.join(__dirname, projFolder, 'index.html');

  const template = await fsPromises.readFile(templateFilePath, {
    encoding: 'utf-8',
  });
  await fsPromises.writeFile(HTMLFilePath, template);

  const HTML = await fsPromises.readFile(templateFilePath, {
    encoding: 'utf-8',
  });
  const components = await fsPromises.readdir(componentFilesPath, {
    withFileTypes: true,
  });
  const bundleHTML = await HTMLInterpolation(
    HTML,
    components,
    componentFilesPath,
  );
  await fsPromises.writeFile(HTMLFilePath, bundleHTML);
}

async function HTMLInterpolation(template, files, filesPath) {
  for (let i = 0; i < files.length; i += 1) {
    const filePath = path.join(filesPath, files[i].name);
    if (path.extname(filePath) === '.html' && files[i].isFile()) {
      const fileName = files[i].name.slice(0, files[i].name.indexOf('.'));
      const fileContent = await fsPromises.readFile(filePath, {
        encoding: 'utf-8',
      });
      template = template.replace(`{{${fileName}}`, fileContent);
    }
  }
  return template;
}

async function mergeStyles() {
  const styleSource = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, projFolder, 'styles.css');

  const files = await fsPromises.readdir(styleSource, { withFileTypes: true });

  const writeableStream = fs.createWriteStream(bundlePath);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(styleSource, file.name);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const readableStream = fs.createReadStream(filePath, {
          encoding: 'utf-8',
        });

        readableStream.on('data', (chunk) => {
          writeableStream.write(chunk);
        });
      }
    }
  });
}

async function copyDir(sourcePath, destPath) {
  try {
    await fsPromises.rm(destPath, { force: true, recursive: true });
    await fsPromises.mkdir(destPath);
    const files = await fsPromises.readdir(
      sourcePath,
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err);
        return files;
      },
    );
    files.forEach((file) => {
      const fileSource = path.join(sourcePath, file.name);
      const fileDuplicate = path.join(destPath, file.name);
      if (file.isDirectory()) {
        copyDir(fileSource, fileDuplicate);
      } else {
        fsPromises.copyFile(fileSource, fileDuplicate);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

createProjDist();
