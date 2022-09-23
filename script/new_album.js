'use strict';  // Try without strict mode

const urlPost = 'http://localhost:3000/api/newalbum';
const urlJson = './app-data/library/picture-library.json';


const addNewAlbum = document.getElementById('addNewAlbum');
// const urlPost = 'http://localhost:3000/api/upload/album';
// const urlJson = './app-data/library/picture-library.json';
// ./ leta utanför map


addNewAlbum.addEventListener('submit', async event => {
    event.preventDefault();

    //Create the key/value pairs used in the form
    const formData = new FormData(addNewAlbum);
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
})
