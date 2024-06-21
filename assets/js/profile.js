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

  if (fileInput.files[0] == undefined) {
    notification.style.display = "block";
    notification.style.border = "1px solid red";
    notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
    notification.style.color = "red"
    notification.innerHTML = `<strong>Upload Field Empty</strong>`;
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
    return;
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
        notification.style.color = "red"
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
// Search box input
const searchBox = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');
let timeoutId;
const debounceDelay = 300; 
const searchCache = {}; 

const fetchSearchResults = async (searchTerm) => {
  //Implemented a hash table for less query for search
  if (searchCache[searchTerm]) {
    return searchCache[searchTerm];
  }

  const response = await fetch(`/user/search?q=${encodeURIComponent(searchTerm)}`);
  const data = await response.json();
  const searchResults = Array.isArray(data) ? data : [];
  searchCache[searchTerm] = searchResults; // Storing the result for future uses
  return searchResults;
};

searchBox.addEventListener('input', () => {
  const searchTerm = searchBox.value.trim().toLowerCase();

  if (!searchTerm) {
    resultsList.style.display = 'none';
    return;
  }

  clearTimeout(timeoutId);

  timeoutId = setTimeout(async () => {
    try {
      const searchResults = await fetchSearchResults(searchTerm);
      const filteredResults = searchResults.filter((result) =>
        result.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

      resultsList.innerHTML = '';

      if (filteredResults.length) {
        resultsList.style.display = 'block';
        filteredResults.forEach((result) => {
          const listItem = document.createElement('li');
          listItem.textContent = result;
          resultsList.appendChild(listItem);
          listItem.addEventListener('click', () => {
            searchBox.value = result;
            resultsList.style.display = 'none';
          });
        });
      } else {
        resultsList.style.display = 'none'; // Hide the list if no results
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      resultsList.style.display = 'none'; // Hide the list in case of an error
    }
  }, debounceDelay);
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
    notification.style.color = "red"
    notification.style.backgroundColor = "hsla(0, 66%, 50%, 0.2)";
    notification.innerHTML = `<strong>${error}</strong>`;
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }
}

// ------- follower pop up --------- //

function openPopup() {
  document.getElementById("popup-content").style.display = "block";
  // Get the search box value from local storage (if available)
  const searchBox = document.getElementById("search-box");
  const storedSearchTerm = localStorage.getItem("followerSearch");
  if (storedSearchTerm) {
    searchBox.value = storedSearchTerm;
  }
}

function closePopup() {
  const closeIcon = document.querySelector(".close-icon");
  closeIcon.addEventListener("click", () => {
    document.getElementById("popup-content").style.display = "none";
    // Clear search box value and local storage on close
    const searchBox = document.getElementById("search-box");
    searchBox.value = "";
    localStorage.removeItem("followerSearch");
  });
}

// Call closePopup() on page load (optional)
closePopup();

// Sample follower data (replace with your actual data)
const followers = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emily",
];

function searchFollowers() {
  const searchBox = document.getElementById("search-box");
  const searchTerm = searchBox.value.toLowerCase(); // Make search case-insensitive
  const searchResults = document.getElementById("search-results");

  searchResults.innerHTML = ""; // Clear previous results before adding new ones

  // Filter followers based on search term
  const filteredFollowers = followers.filter(follower => follower.toLowerCase().includes(searchTerm));

  // Display search results
  if (filteredFollowers.length > 0) {
    filteredFollowers.forEach(follower => {
      const suggestionBox = document.createElement("div"); // Use a div for each suggestion
      suggestionBox.classList.add("suggestion"); // Add a class for styling

      const suggestionText = document.createElement("span"); // Create a span for the follower name
      suggestionText.textContent = follower;
      suggestionBox.appendChild(suggestionText);

      suggestionBox.addEventListener("click", () => {
        searchBox.value = follower; // Set search box value on click
        searchResults.innerHTML = ""; // Hide suggestions after selection
      });

      searchResults.appendChild(suggestionBox);
    });
  } else {
    searchResults.innerHTML = "No results found"; // Display clear message without a dot
  }
}

// Add event listener for search box input
const searchBox1 = document.getElementById("search-box");
searchBox1.addEventListener("keyup", searchFollowers);

// Add event listener for window close (optional)
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("followerSearch");
});




// ------- following pop up --------- //

function openFollowingPopup() {
  document.getElementById("following-popup").style.display = "block";
  // Get the search box value from local storage (if available)
  const searchBox = document.getElementById("following-search-box");
  const storedSearchTerm = localStorage.getItem("followingSearch");
  if (storedSearchTerm) {
    searchBox.value = storedSearchTerm;
  }
}

function closeFollowingPopup() {
  const closeIcon = document.querySelector(".close2-icon");
  closeIcon.addEventListener("click", () => {
    document.getElementById("following-popup").style.display = "none";
    // Clear search box value and local storage on close
    const searchBox = document.getElementById("following-search-box");
    searchBox.value = "";
    localStorage.removeItem("followingSearch");
  });
}

// Call closeFollowingPopup() on page load (optional)
closeFollowingPopup();

// Sample following data (replace with your actual data)
const followings = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emily",
];

function searchFollowings() {
  const searchBox = document.getElementById("following-search-box");
  const searchTerm = searchBox.value.toLowerCase(); // Make search case-insensitive
  const searchResults = document.getElementById("following-search-results");

  searchResults.innerHTML = ""; // Clear previous results before adding new ones

  // Filter followings based on search term
  const filteredFollowings = followings.filter(following => following.toLowerCase().includes(searchTerm));

  // Display search results
  if (filteredFollowings.length > 0) {
    filteredFollowings.forEach(following => {
      const suggestionBox = document.createElement("div"); // Use a div for each suggestion
      suggestionBox.classList.add("following-suggestion"); // Add a class for styling

      const suggestionText = document.createElement("span"); // Create a span for the follower name
      suggestionText.textContent = following;
      suggestionBox.appendChild(suggestionText);

      suggestionBox.addEventListener("click", () => {
        searchBox.value = following; // Set search box value on click
        searchResults.innerHTML = ""; // Hide suggestions after selection
      });

      searchResults.appendChild(suggestionBox);
    });
  } else {
    searchResults.innerHTML = "No results found"; // Display clear message without a dot
  }
}

// Add event listener for search box input
const searchBox2 = document.getElementById("following-search-box");
searchBox2.addEventListener("keyup", searchFollowings);

// Add event listener for window close (optional)
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("followingSearch");
});


