//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

//Obtain album from URL:
const albumQuery = window.location.search.substring(1);
const searchParams = new URLSearchParams(albumQuery);
var isRatingAlbum = false;
var isAlbum = false;
if(searchParams.has('album')) {
  isAlbum = true;
}
else if(searchParams.has('stars')) {
  isRatingAlbum = true;
}

let counter = 0;
let allPictureIds = [];

for (const album of library.albums) {
    if(isAlbum && album.id == searchParams.get('album')) {
      for (let picture of album.pictures) {
        counter++;
        allPictureIds.push(picture.id);
        renderImage(
          `${album.path}/${picture.imgLoRes}`, 
          `${album.path}/${picture.imgHiRes}`, 
          picture.id, 
          picture.title, 
          picture.comment,
          counter
        );
      }
    }
    else if(isRatingAlbum) {
      for(let picture of album.pictures) {
        if(picture.rating !== null && 
          picture.rating !== undefined && 
          picture.rating !== NaN && 
          picture.rating == searchParams.get('stars')) {
            counter++;
            allPictureIds.push(picture.id);
            renderImage(
              `${album.path}/${picture.imgLoRes}`, 
              `${album.path}/${picture.imgHiRes}`, 
              picture.id, 
              picture.title, 
              picture.comment,
              counter
          );
        }
      }
    }
  }

  //Event listeners for checkboxes
  let formSwitches = document.querySelectorAll(".form-switch");
  formSwitches.forEach(formSwitch => {
    formSwitch.addEventListener("click", linkCheckboxes);
  });

  //Event listeners for buttons
  document.getElementById('redirectAll').addEventListener("click", redirectAll);
  document.getElementById('redirectSelected').addEventListener("click", redirectSelection);

  //Event listener for checking if button should be enabled or not
  let allCheckboxes = document.querySelectorAll('.form-switch');
  allCheckboxes.forEach(x => addEventListener("click", enableRedirectSelection));


});

//Render the images
function renderImage(loResSrc, hiResSrc, tag, title, comment, iterator) {
  /*<div class="card">
      <a href="..." target="_self>
        <img src="..." srcset="..." class="card-img-top" alt="...">
      </a>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">....</li>
        <li class="list-group-item ellipsis-clip">....</li>
        <li class="list-group-item">
          <div class="form-check form-switch d-flex justify-content-between">
            <input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
            <label class="form-check-label order-1" for="...">Add to slideshow</label>
          </div>
        </li>
      </ul>
    </div>
  */

  for(let i = 1; i <= 4; i++) {
      //<div class="card">
      let card = document.createElement('div');
      card.className = `card`;
    
      //<a href="..." target="_self class="card-link">
      let aHref = document.createElement('a');
      aHref.href = `zoomed_image.html?${tag}`;
      aHref.target = "_self";
      aHref.className = `card-link`;
    
      //<img src="..." srcset="..." class="card-img-top" alt="...">
      let img = document.createElement('img');
      img.src = hiResSrc;
      img.srcset = `${loResSrc}, ${hiResSrc} 2x`;    //Actual width is unknown
      img.loading = `lazy`;
      img.className = `card-img-top`;
      img.alt = title;
      aHref.appendChild(img);
      card.appendChild(aHref);
    
      //<ul class="list-group list-group-flush">
      let ul = document.createElement('ul');
      ul.className = `list-group list-group-flush`;
    
      //<li class="list-group-item">....</li>
      let li1 = document.createElement('li');
      li1.className = `list-group-item`;
      let h6 = document.createElement('h6');
      h6.className = `mb-0`;
      let text1 = document.createTextNode(title);
      h6.appendChild(text1);
      li1.appendChild(h6);
    
      //<li class="list-group-item">....</li>
      let li2 = document.createElement('li');
      li2.className = `list-group-item ellipsis-clip`;
      let text2 = document.createTextNode(comment);
      li2.appendChild(text2);
    
      //<li class="list-group-item">
      let li3 = document.createElement('li');
      li3.className = `list-group-item`;
  
      //<div class="form-check form-switch d-flex justify-content-between">
      let formSwitch = document.createElement('div');
      formSwitch.className = `form-check form-switch d-flex justify-content-between`;
      formSwitch.dataset.check = `${i}${tag}`;
  
      //<input class="form-check-input order-2" type="checkbox" id="..." name="check" role="switch" id="...">
      let check = document.createElement('input');
      check.className = `form-check-input order-2`;   //Reversing order to stay consistent with Bootstrap docs
      check.setAttribute("type", "checkbox");
      check.dataset.id = tag;
      check.id = `${i}${tag}`;
      check.name = "check";
      check.value = tag;
      formSwitch.appendChild(check);
  
      //<label class="foform-check-label order-1" for="...">Add to slideshow</label>
      let formLabel = document.createElement('label');
      formLabel.className = `form-check-label order-1`;   //Reversing order to stay consistent with Bootstrap docs
      formLabel.for = `${i}${tag}`;
      let labelText = document.createTextNode('Add to slideshow');
      formLabel.appendChild(labelText);
      formSwitch.appendChild(formLabel);
  
      //li
      li3.appendChild(formSwitch);
    
      //</ul>
      ul.appendChild(li1);
      ul.appendChild(li2);
      ul.appendChild(li3);
      card.appendChild(ul);
      //</div>

      //Append to correct columns depending on iteration
      if(i === 1) {
        let col1 = document.getElementById('c1');
        col1.appendChild(card);    
      }
      else if(i === 2) {
        if(iterator % 2 === 1) {
          const col2 = document.getElementById('c2');
          col2.appendChild(card);
        }
        else {
          const col3 = document.getElementById('c3');
          col3.appendChild(card);
        }
      }
      else if(i === 3) {
        if(iterator % 3 === 1) {
          const col4 = document.getElementById('c4');
          col4.appendChild(card);
        }
        else if (iterator % 3 === 2){
          const col5 = document.getElementById('c5');
          col5.appendChild(card);
        }
        else {
          const col6 = document.getElementById('c6');
          col6.appendChild(card);
        }
      }
      else {
        if(iterator % 4 === 1) {
          const col7 = document.getElementById('c7');
          col7.appendChild(card);
        }
        else if (iterator % 4 === 2){
          const col8 = document.getElementById('c8');
          col8.appendChild(card);
        }
        else if (iterator % 4 === 3) {
          const col9 = document.getElementById('c9');
          col9.appendChild(card);
        }
        else {
          const col10 = document.getElementById('c10');
          col10.appendChild(card);
        }
      }
  }
  };

//Only enable the button to redirect selected when something is actually selected
function enableRedirectSelection() {
  let btn = document.getElementById('redirectSelected');
  let checkboxes = document.querySelectorAll('input[name=check]:checked');

  if(checkboxes.length > 0) {
    btn.disabled = false;
  }
  else {
    btn.disabled = true;
  }
}

//Link checkboxes together when clicked
function linkCheckboxes(e) {
  let outerDiv = e.target;
  let checkId = outerDiv.id;    // This should have been outerDiv.dataset.id, but not according to debugging. 
  let check = document.getElementById(checkId);

  if(!check) return;

  let isChecked = check.checked;
  let idGroup = check.dataset.id;
  let queryString = `[data-id="${idGroup}"]`;
  let checkboxGroup = document.querySelectorAll(queryString);
  let checkboxGroupArray = [...checkboxGroup];
  let otherCheckboxes = checkboxGroupArray.filter(box => box.id != checkId);
  otherCheckboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

//onclick to redirect to slideshow
function redirectAll() {
  //Just re-use the same query as on the album_view page
  const albumQuery = window.location.search.substring(1);
  const searchParams = new URLSearchParams(albumQuery);

  if(searchParams.has('album')) {
    window.location.href = `slideshow.html?album=${searchParams.get('album')}`;
  }
  else if(searchParams.has('stars')) {
    window.location.href = `slideshow.html?stars=${searchParams.get('stars')}`;
  }  
}

//onclick to redirect to slideshow, but only with selected images
function redirectSelection() {
  //Get checkboxes then turn it ino an array to use .map
  let checkboxes = [...document.querySelectorAll('input[name=check]:checked')];
  //.map with only the values
  let checkboxValues = checkboxes.map(box => box.value);
  //Remove duplicate values
  let uniqueValues = [...new Set(checkboxValues)]
  //New URLSearchParams
  let newSearchParams = new URLSearchParams('');

  //Add all unique values as search paramters
  for(let i = 0; i < uniqueValues.length; i++) {
    newSearchParams.append('id', uniqueValues[i]);
  }

  //Redirect to slideshow with the search paramters
  window.location.href = `slideshow.html?${newSearchParams.toString()}`;

}


