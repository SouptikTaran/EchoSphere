function openPop(e) {
  z = e + "popup";
  console.log(z);
  document.getElementById('popupOverlay').style.display = "block";
}
function closePop(e) {
  z = e.substring(0, 5);
  z = z + "popup";
  console.log(z);
  document.getElementById('popupOverlay').style.display = "none";
}


var img = document.getElementById("uploadImage");
var displayImage = document.getElementById("displayImage");
var notification = document.getElementById("noti");
var noti = document.getElementById("noti-msg");

img.addEventListener("input", function () {
  var formData = new FormData();
  formData.append('profileImage', img.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/post/profile', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.success) {
        const timestamp = new Date().getTime();
        const newImageUrl = response.newImageUrl + "?t=" + timestamp;
        displayImage.src = newImageUrl;
        profileIcon.src = newImageUrl;

        notification.style.display = "block";
        notification.innerHTML = `<strong>${response.msg}</strong>`;
        setTimeout(() => {
          notification.style.display = "none";
        }, 3000);

      }
    } else {
      notification.style.display = "block";
      notification.style.border = "1px solid red";
      notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
      notification.innerHTML = `<strong>An error occurred while uploading the file</strong>`;
      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
    }
  };

  xhr.send(formData);
})


//dynamic height
function adjustPostContainerHeight() {
  // Get the container element
  const container = document.getElementById('myPostContainer'); // Replace with your container ID
  if (!container) {
    console.error('Post container element not found');
    return;
  }

  // Get all post elements within the container
  const postElements = container.querySelectorAll('.post');

  // Calculate total height based on post heights
  let totalHeight = 0;
  for (const post of postElements) {
    totalHeight += post.offsetHeight; // Get actual rendered height of each post
  }

  // Update container height
  container.style.height = `${totalHeight}px`;
}

// Call the function on page load or after content is loaded dynamically
window.addEventListener('load', adjustPostContainerHeight);


const postContainer = document.getElementById("postContainer");



function uploadPost() {

  var formData = new FormData();
  var fileInput = document.getElementById('avatar');
  console.log(fileInput.files[0])

  if(fileInput.files[0] == undefined){
    notification.style.display = "block";
    notification.style.border = "1px solid red";
    notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
    notification.style.color= "red"
    notification.innerHTML = `<strong>Upload Field Empty</strong>`;
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
    return ;
  }
  formData.append('avatar', fileInput.files[0]);


  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/post/userpost', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.success) {
        closePop('closePopup');
        //creating and appending into the main structure
        var imageDiv = document.createElement('div');
        imageDiv.classList.add('post');
        var imageElement = document.createElement('img');
        imageElement.classList.add('post-img');
        imageElement.src = response.newImageUrl;
        console.log(imageElement);
        imageDiv.appendChild(imageElement)
        console.log(imageDiv);
        postContainer.appendChild(imageDiv)

        var overlay = document.createElement('div');
        overlay.classList.add('overlay');
        imageDiv.append(overlay)

        var delbtn = document.createElement('div')
        delbtn.classList.add('del-btn')
        var deleteLink = document.createElement('a');
        deleteLink.classList.add('btn-sty', 'fa', 'fa-trash-o');
        deleteLink.style.fontSize = "36px";
        deleteLink.onclick = function () {
          var src = response.newImageUrl; // Assuming post[i] is the server-side value
          deleteImage(src);
        };
        delbtn.appendChild(deleteLink);
        imageDiv.appendChild(delbtn)


        //notification 
        notification.style.display = "block";
        notification.innerHTML = `<strong>${response.msg}</strong>`;
        setTimeout(() => {
          notification.style.display = "none";
        }, 3000);
      } else {
        notification.style.display = "block";
        notification.style.border = "1px solid red";
        notification.style.color= "red"
        notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
        notification.innerHTML = `<strong>${respose.msg}</strong>`;
        setTimeout(() => {
          notification.style.display = "none";
        }, 3000);
      }
    }
  }
  xhr.send(formData)
}


//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//


//search box input
const searchBox = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');

// Predefined search results
const searchResults = ["Abhi", "Dev", "Ekta", "Alis", "Soup", "Shamik"];

searchBox.addEventListener('input', () => {
  const searchTerm = searchBox.value.trim().toLowerCase();

  if (!searchTerm) {
    resultsList.style.display = 'none';
    return;
  }

  const filteredResults = searchResults.filter((result) =>
    result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  resultsList.innerHTML = ''; // Clear previous results

  if (filteredResults.length) {
    resultsList.style.display = 'block';
    filteredResults.forEach((result) => {
      const listItem = document.createElement('li');
      listItem.textContent = result;
      resultsList.appendChild(listItem);

      // Add event listener for click on each list item
      listItem.addEventListener('click', () => {
        searchBox.value = result; // Update search box with clicked result
        resultsList.style.display = 'none'; // Hide the dropdown after click
      });
    });
  } else {
    resultsList.style.display = 'none'; // Hide the list if no results
  }
});



//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//


async function deleteImage(src) {
  try {
    const response = await fetch('/post/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ src })
    });

    const result = await response.json();
    console.log(result);
    var postElements = document.querySelectorAll('.post');
    for (let i = 0; i < postElements.length; i++) {
      var imgElement = postElements[i].querySelector('.post-img');
      if (imgElement && imgElement.getAttribute('src') === src) {
        postElements[i].remove();
        break;
      }
    }
    notification.style.display = "block";
    notification.innerHTML = `<strong>${result.msg}</strong>`;
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  } catch (error) {
    console.error('Error deleting image:', error);
    notification.style.display = "block";
    notification.style.border = "1px solid red";
    notification.style.color= "red"
    notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
    notification.innerHTML = `<strong>${error}</strong>`;
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }
}