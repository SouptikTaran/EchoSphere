function openPop(e) {
  z = e + "popup";
  document.getElementById('popupOverlay').style.display = "block";
  document.getElementById(z).style.display = "block";
}
function closePop(e) {
  console.l
  z = e.substring(0, 4);
  z = z + "popup";
  document.getElementById('popupOverlay').style.display = "none";
  document.getElementById(z).style.display = "none";
}


var img = document.getElementById("uploadImage");
var displayImage = document.getElementById("displayImage");
var notification = document.getElementById("notification");

img.addEventListener("input", function () {
  // console.log(img.files[0])
  var formData = new FormData();
  formData.append('profileImage', img.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/post/profile', true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("xhr.responseText : ", xhr.responseText);
      const response = JSON.parse(xhr.responseText);
      console.log(response)
      if (response.success) {
        const timestamp = new Date().getTime();
        const newImageUrl = response.newImageUrl + "?t=" + timestamp;
        displayImage.src = newImageUrl;
        profileIcon.src = newImageUrl;

        notification.style.display = "block"
        setTimeout(() => {
          notification.style.display = "none";
        }, 3000);
      }
    } else {
      alert("An error occurred while uploading the file.");
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
