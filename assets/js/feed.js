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

