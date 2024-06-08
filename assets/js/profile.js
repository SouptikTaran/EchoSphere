// document.addEventListener('DOMContentLoaded', function () {

//   const popupOverlay = document.getElementById('popupOverlay');

//   const popup = document.getElementById('popup');

//   const closePopup = document.getElementById('closePopup');



//   // Function to open the popup

//   function openPopup() {

//     popupOverlay.style.display = 'block';

//   }

//   // Function to close the popup

//   function closePopupFunc() {

//     popupOverlay.style.display = 'none';

//   }


  
//   // Event listeners
  
//   // Trigger the popup to open (you can call this function on a button click or any other event)
  
//   const button = document.getElementById("myButton"); // Assuming you have a button with id="myButton"
//   button.addEventListener("click", openPopup);

//   const button2 = document.getElementById("myBtn"); // Assuming you have a button with id="myButton"
//   button2.addEventListener("click", openPopup);

//   const button3 = document.getElementById("myprof"); // Assuming you have a button with id="myButton"
//   button3.addEventListener("click", openPopup);
  


//   // Close the popup when the close button is clicked

//   closePopup.addEventListener('click', closePopupFunc);

//   // Close the popup when clicking outside the popup content

//   popupOverlay.addEventListener('click', function (event) {

//     if (event.target === popupOverlay) {
//       closePopupFunc();
//     }
//   });
// });





// document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
//   const dropZoneElement = inputElement.closest(".drop-zone");



//   dropZoneElement.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     dropZoneElement.classList.add("drop-zone--over");
//   });

//   ["dragleave", "dragend"].forEach((type) => {
//     dropZoneElement.addEventListener(type, (e) => {
//       dropZoneElement.classList.remove("drop-zone--over");
//     });
//   });

//   dropZoneElement.addEventListener("drop", (e) => {
//     e.preventDefault();

//     if (e.dataTransfer.files.length) {
//       inputElement.files = e.dataTransfer.files;
//       updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
//     }

//     dropZoneElement.classList.remove("drop-zone--over");
//   });
// });

// /**
//  * Updates the thumbnail on a drop zone element.
//  *
//  * @param {HTMLElement} dropZoneElement
//  * @param {File} file
//  */
// function updateThumbnail(dropZoneElement, file) {
//   let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

//   // First time - remove the prompt
//   if (dropZoneElement.querySelector(".drop-zone__prompt")) {
//     dropZoneElement.querySelector(".drop-zone__prompt").remove();
//   }

//   // First time - there is no thumbnail element, so lets create it
//   if (!thumbnailElement) {
//     thumbnailElement = document.createElement("div");
//     thumbnailElement.classList.add("drop-zone__thumb");
//     dropZoneElement.appendChild(thumbnailElement);
//   }

//   thumbnailElement.dataset.label = file.name;

//   // Show thumbnail for image files
//   if (file.type.startsWith("image/")) {
//     const reader = new FileReader();

//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
//     };
//   } else {
//     thumbnailElement.style.backgroundImage = null;
//   }
// }


// const profile = document.getElementById("pic")
// const option = document.getElementById("ppic")
// const profileIcon = document.getElementById("myprof")

// const post1 = document.getElementById("myButton")
// const post2 = document.getElementById("myBtn")

// profileIcon.addEventListener("click",()=>{
//   profile.style.display="none"
//   option.style.display="block"
// })

// post1.addEventListener("click",()=>{
//   profile.style.display="block"
//   option.style.display="none"
// })

// post2.addEventListener("click",()=>{
//   profile.style.display="block"
//   option.style.display="none"
// })




// let isProfileVisible = true; // Track profile visibility state

// profileIcon.addEventListener("click", () => {
//   if (isProfileVisible) {
//     profile.style.display = "none";
//     option.style.display = "block";
//     isProfileVisible = false; // Update state after hiding profile
//   } else {
//     // Optional: Handle the case where option is already visible
//     console.log("Option is already visible.");
//   }
// });

function openPop(e){
  z = e + "popup";
  document.getElementById('popupOverlay').style.display = "block";
  document.getElementById(z).style.display = "block";
}
function closePop(e){
  console.l
  z = e.substring(0,4);
  z = z + "popup";
  document.getElementById('popupOverlay').style.display = "none";
  document.getElementById(z).style.display = "none";
}