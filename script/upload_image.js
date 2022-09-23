'use strict';  // Try without strict mode

import * as lib from '../model/picture-library-browser.js';
import * as proto from '../model/picture-album-prototypes.js';

const libraryJSON = 'picture-library.json';
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  getAlbumTitle(library.albums);
});

window.addEventListener('click', () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log(`library has ${library.albums.length} albums`);
});

let dropdown = document.getElementById('albumSelect');
dropdown.length = 0;

let defaultOption = document.createElement('option');
defaultOption.text = 'Choose Album';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

function getAlbumTitle(data) {
  let option;

  for (const element of data) {
    option = document.createElement('option');
    option.text = element.title;
    option.value = element.title.replace(/\s+/g, '-').toLowerCase();
    dropdown.add(option);
  }
};


/*Denna kod är för att få upp bild tillfäligt på browsern*/
const image_input = document.querySelector("#imageinput");
image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});

//Event listener to check file size
const imageinputsmall = document.querySelector('#imageinputsmall');
imageinputsmall.addEventListener("change", function () {
  if (this.files[0].size > 102400) {
    alert("File is too big! Max size is 100kB.");
    this.value = "";
  }
  else {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      document.querySelector("#display-imagesmall").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
  }
});

const urlPost = 'http://localhost:3000/api/newimage';
const urlJson = './app-data/library/picture-library.json';
const uploadImageForm = document.getElementById('uploadImageForm');

uploadImageForm.addEventListener('submit', async event => {
  event.preventDefault();

  //Create the key/value pairs used in the form
  const formData = new FormData(uploadImageForm);
  try {
    //send the data using post and await the reply
    const response = await fetch(urlPost, {
      method: 'post',
      body: formData
    });
    const result = await response.text();

    if (response.ok) {

      const response = await fetch(urlJson);
      const data = await response.text();

      alert(`The image has been submitted successfully.\n` +
        `${data}`);
    }
    else {
      alert(`Failed to recieve data from server: ${response.status}`);
    }
    console.log(result);
  }
  catch {
    alert("Transmission error");
  }
});