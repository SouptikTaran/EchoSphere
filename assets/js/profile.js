document.addEventListener('DOMContentLoaded', function () {

    const popupOverlay = document.getElementById('popupOverlay');

    const popup = document.getElementById('popup');

    const closePopup = document.getElementById('closePopup');


    // Function to open the popup

    function openPopup() {

        popupOverlay.style.display = 'block';

    }

    // Function to close the popup

    function closePopupFunc() {

        popupOverlay.style.display = 'none';

    }

    // Event listeners

    // Trigger the popup to open (you can call this function on a button click or any other event)
    var button = document.getElementById("myButton");
    button.addEventListener("click", openPopup);

    // Close the popup when the close button is clicked

    closePopup.addEventListener('click', closePopupFunc);

    // Close the popup when clicking outside the popup content

    popupOverlay.addEventListener('click', function (event) {

        if (event.target === popupOverlay) {

            closePopupFunc();

        }

    });
});