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

for (const album of library.albums) {
    renderAlbum(album.headerImage, album.id, album.title);
  }
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the albums
function renderAlbum(src, id, title) {
  /*
  <div class="gallery" >
    <a target="_self" href="album_view.html" >
      <img src="app-data/library/pictures/album-header/A Galactic Spectacle_4862916839_o~small.jpg" alt="Newborn Stars" width="600" height="400" >
    </a>
    <div class="desc">Newborn Stars</div>
  </div>
  */

  //<div class="gallery" >
  const gallery = document.createElement('div');
  gallery.className = `gallery`;

  //<a target="_self" href="album_view.html" >
  const a = document.createElement('a');
  a.href = `album_view.html?album=${id}`;
  a.target = "_self";
  a.dataset.albumId = id;

  //<img src="app-data/library/pictures/album-header/A Galactic Spectacle_4862916839_o~small.jpg" alt="Newborn Stars" width="600" height="400" >
  const img = document.createElement('img');
  img.src = src;
  img.alt = title;
  img.width = "600";
  img.height = "400";

  //<div class="desc">Newborn Stars</div>
  const desc = document.createElement('div');
  desc.className = `desc`;
  const textNode = document.createTextNode(title);
  desc.appendChild(textNode);

  //Appending
  a.appendChild(img);
  gallery.appendChild(a);
  gallery.appendChild(desc);
  const albums = document.getElementById('albums');
  albums.appendChild(gallery);
};
