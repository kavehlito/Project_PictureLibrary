//required node library
const path = require('path');
const fs = require('fs');

const express = require('express');
const formidable = require('formidable');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

//Middleware in express.js to read json body
app.use(express.json());

const appDir = '../app-data/library';
const appJson = 'picture-library.json';

/*------------------------------------------------------ */

app.get('/api/upload', (req, res) => {
  response = readJSON(appJson);
  res.send(response);
});


app.post('/api/upload', (req, res) => {
  const b = req.body;
  writeJSON(appJson, b);

  //responds with the json file
  res.json(b);
});

app.post('/api/newimage', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);

    let obj = {};
    let pic;

    //Obtain already existing json
    if (fileExists(appJson)) {
      obj = readJSON(appJson);
    }

    //Fields and files
    const imageTitle = fields['title'];
    const imageDesc = fields['description'];
    const imgPath = fields['albumSelect'].replace(/\s+/g, '-').toLowerCase();
    const fileName = files.imageinput.originalFilename;
    let fileNameSmallTemp = files.imageinputsmall.originalFilename;
    const fileNameSmall = (fileNameSmallTemp === '')? fileName : fileNameSmallTemp;

    //Relocate images to correct location
    if (fileIsValidImage(files.imageinput)) {
      fileRelocate(files.imageinput, 'pictures/' + imgPath);
    }

    if(files.imageinputsmall) {
      if (fileIsValidImage(files.imageinputsmall)) {
        fileRelocate(files.imageinputsmall, 'pictures/' + imgPath);
      }
    }

    //update the json file
    for (const album in obj) {
      if (Object.hasOwnProperty.call(obj, album)) {
        const element = obj[album];
        for (const item of element) {
          if (item.title.replace(/\s+/g, '-').toLowerCase() === imgPath.replace(/\s+/g, '-').toLowerCase()) {
            //console.log(item.id);
            pic = item.pictures;
          }
        }
        console.log(element);
      }
    };
    pic.push({
      id: uniqueId(),
      title: imageTitle,
      comment: imageDesc,
      imgLoRes: fileNameSmall,
      imgHiRes: fileName
    });

    //Respond
    writeJSON(appJson, obj);
    res.sendStatus(200);
  });
});

app.post('/api/newalbum', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);

    let jason = {};

    if (fileExists(appJson))
      jason = readJSON(appJson);

    //get the fiields sent over from browser
    const origAlbumTitle = fields['albumTitle'];
    const albumTitle = fields['albumTitle'].replace(/\s+/g, '-').toLowerCase();
    const albumComment = fields['albumComment'];

    //Get original file name
    const pictureName = files.albumFile.originalFilename;

    if (albumTitle != '') {
      //create the directory
      dirCreate('pictures/' + albumTitle);

      //Store the image in the album-header
      if (fileIsValidImage(files.albumFile)) {
        fileRelocate(files.albumFile, 'pictures/album-header');
      }

      //update the json file
      jason.albums.push({
        id: uniqueId(),
        title: origAlbumTitle,
        comment: albumComment,
        path: 'app-data/library/pictures/' + albumTitle,
        headerImage: 'app-data/library/pictures/album-header/' + pictureName,
        pictures: []
      });

      writeJSON(appJson, jason);
    }

    //send success response
    res.sendStatus(200);
  });
});

app.listen(port, () =>
  console.log(`Node server listening at http://localhost:${port}`)
);

/*------------------------------------------------------ */

//helper functions to check for files and directories
function fileExists(fname) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));
  return fs.existsSync(path.resolve(appDataDir, fname));
}

function dirCreate(fpath) {

  //All directories are create in appDir
  const fullPath = path.normalize(path.join(appDir, fpath));

  //loop over all directories in the path
  const dirs = fullPath.split(path.sep); // / on mac and Linux, \\ on windows
  let baseDir = path.join(__dirname);

  for (const appendDir of dirs) {

    baseDir = path.join(baseDir, appendDir);

    //create the directory if it does not exist
    if (!fs.existsSync(baseDir)) {
      console.log(`create dir ${baseDir}`)
      fs.mkdirSync(path.resolve(baseDir));
    }
  }
}

//helper functions to store an image
function fileIsValidImage(file) {
  //Is there a file
  if (file.originalFilename === '' || file.size === 0)
    return false;

  //check if the img format is correct
  const type = file.mimetype.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "webp"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }

  return true;
};

//Parameters are the file itself and the path
function fileRelocate(file, imgPath) {
  /*The encodeURIComponent() function encodes a URI by replacing each instance of certain characters by one, 
  two, three, or four escape sequences representing the UTF-8 encoding of the character 
  (will only be four escape sequences for characters composed of two "surrogate" characters).*/
  const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));

  const albumPathRelative = path.join(appDir, imgPath, fileName);
  const albumPath = path.normalize(path.join(__dirname, appDir, imgPath, fileName));
  const downloadedPath = file.filepath;

  try {
    /*The fs.renameSync() method is used to synchronously rename a file at the given old path to the given new path. 
    It will overwrite the destination file if it already exists.
    fs.renameSync( oldPath, newPath )*/
    fs.renameSync(downloadedPath, albumPath);
  }
  catch (err) {
    console.log(err);
  }

  return albumPathRelative;
}

//helper functions to read and write JSON
function writeJSON(fname, obj) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));

  if (!fs.existsSync(appDataDir))
    fs.mkdirSync(appDataDir);

  fs.writeFileSync(path.join(appDataDir, fname), JSON.stringify(obj));
}

function readJSON(fname) {
  const appDataDir = path.normalize(path.join(__dirname, appDir));
  obj = JSON.parse(fs.readFileSync(path.join(appDataDir, fname), 'utf8'));
  return obj;
}

function uniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};