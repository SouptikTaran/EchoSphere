const searchBox = document.getElementById('searchId');
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
        result.toLowerCase().startsWith(searchTerm.toLowerCase())
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


//pop up window-------

document.addEventListener('DOMContentLoaded', function () {

  const popupOverlay = document.getElementById('popupOverlay');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('closePopup');
  const openpop = document.getElementById('setbtn');

  function openPopup() {
      popupOverlay.style.display = 'block';
  }

  function closePopupFunc() {
      popupOverlay.style.display = 'none';
  }

  // Event listeners

  openpop.addEventListener('click',openPopup);

  // Close the popup when the close button is clicked

  closePopup.addEventListener('click', closePopupFunc);

  // Close the popup when clicking outside the popup content

  popupOverlay.addEventListener('click', function (event) {
      if (event.target === popupOverlay) {
          closePopupFunc();
      }
  });
});