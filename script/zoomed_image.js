//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const path = `../app-data/library/picture-library.json`;

const libraryJSON = "picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

    library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
    //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

    for (const album of library.albums) {
        for (const picture of album.pictures) {
            let pictureQuery = window.location.search.substring(1);
            if (picture.id === pictureQuery) {
                renderImage(
                    `${album.path}/${picture.imgHiRes}`,
                    picture.title
                );
                renderImageTitle(picture.title);
                renderImageDescription(picture.comment);
                if (picture.rating !== null && picture.rating !== undefined && picture.rating != 0) {
                    renderRating(picture.rating);
                }
            }
        }
    }
})

// Event listener to close the pop-up window for edit image
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.popup-bg').style.display = 'none';
});

// Event listener for the edit button pop-up
document.getElementById('editButton').addEventListener('click', () => {
    document.querySelector('.popup-bg').style.display = 'flex';
});

// Even listener for delete image button
let deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener('click', deleteImage);

//Event listener for stars
let stars = document.getElementsByName('stars');
stars.forEach(star => star.addEventListener('click', setNewRating));

//Event listener for submitting title form
const titleForm = document.getElementById('titleForm');
titleForm.addEventListener('submit', renameImageTitle);

//Event listener for submitting comment form
const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', postNewDescription);

// Render the image
function renderImage(hiResSrc, title) {
    const img = document.createElement('img');
    img.className = `main-image`;
    img.src = hiResSrc;
    img.alt = title;

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.appendChild(img);

};

// Render the image title
function renderImageTitle(title) {
    const h2 = document.createElement('h2');
    h2.className = `image-title`;
    h2.textContent = title;

    const titleContainer = document.getElementById('titleContainer');
    titleContainer.appendChild(h2);
}

// Render the image description
function renderImageDescription(description) {
    const p = document.createElement('p');
    p.className = `image-description`;
    p.textContent = description;

    const descriptionContainer = document.getElementById('descriptionContainer');
    descriptionContainer.appendChild(p);

    const commentArea = document.getElementById('commentArea');
    commentArea.placeholder = description;
}

function renderRating(rating) {
    if (rating === null || rating === undefined || rating === 0) {
        return;
    }

    switch (rating) {
        case '1':
            document.querySelector('#star-1').checked = true;
            break;
        case '2':
            document.querySelector('#star-2').checked = true;
            break;
        case '3':
            document.querySelector('#star-3').checked = true;
            break;
        case '4':
            document.querySelector('#star-4').checked = true;
            break;
        case '5':
            document.querySelector('#star-5').checked = true;
            break;
        default:
            break;
    }
}

async function setNewRating() {
    let radios = document.getElementsByName('stars');
    let radiosArray = [...radios];
    let checkedRadio = radiosArray.filter(radio => radio.checked === true)[0];
    let rating = checkedRadio.value;

    //Add to library
    for (const album of library.albums) {
        for (const picture of album.pictures) {
            let pictureQuery = window.location.search.substring(1);
            if (picture.id === pictureQuery) {
                picture.rating = rating;
            }
        }
    }
    console.log(library);

    //Use function
    await lib.pictureLibraryBrowser.postJSON(library, libraryJSON);
}

async function deleteImage() {
    // find the image in the library and delete it
    for (const album of library.albums) {
        for (const picture of album.pictures) {
            let pictureQuery = window.location.search.substring(1);
            if (picture.id === pictureQuery) {
                let index = album.pictures.indexOf(picture);
                album.pictures.splice(index, 1);
                await lib.pictureLibraryBrowser.postJSON(library, libraryJSON);
            }
        }
    }
    location.replace("index.html");
}

// Rename the image
async function renameImageTitle(e) {
    e.preventDefault();

    const titleString = document.getElementById("title").value;

    //Add to library
    for (const album of library.albums) {
        for (const picture of album.pictures) {
            let pictureQuery = window.location.search.substring(1);
            if (picture.id === pictureQuery) {
                picture.title = titleString;
            }
        }
    }
    console.log(library);

    //Use function
    await lib.pictureLibraryBrowser.postJSON(library, libraryJSON);

    //Use function
    //await lib.pictureLibraryBrowser.postJSON(library, libraryJSON);

    location.reload();
}

async function postNewDescription(e) {
    e.preventDefault();

    const commentString = document.getElementById("commentArea").value;

    //Add to library
    for (const album of library.albums) {
        for (const picture of album.pictures) {
            let pictureQuery = window.location.search.substring(1);
            if (picture.id === pictureQuery) {
                picture.comment = commentString;
            }
        }
    }
    console.log(library);

    //Use function
    await lib.pictureLibraryBrowser.postJSON(library, libraryJSON);

    location.reload();
}
