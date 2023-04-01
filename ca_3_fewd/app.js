var randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";
const randomMealImage = document.getElementById("random-meal-img");
const randomMealName = document.getElementsByClassName("random-meal-name")[0];
const getMealButton = document.getElementById("random-meal-btn");
const ingredientBox = document.querySelector(".modal-content");
const getIngredientBtn = document.querySelector("#show-menu");
const searchResultsDiv = document.getElementsByClassName("searched-results")[0];
const categoryButton = document.getElementById("btn-1");
const areaButton = document.getElementById("btn-2");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const inputBox = document.querySelector("input");
const searchedMealsHeading = document.getElementById('searched-results-value')
const randomMealGenerator = () => {
  fetch(randomMealUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network error!");
      }
      return res.json();
    })
    .then((res) => {
      if (!res.meals || res.meals.length === 0) {
        throw new Error("No meals found!");
      }
      // get the first meal in the response and display its image, name, and ingredients
      const food = res.meals[0];
      MealImageApender(food, randomMealImage);
      MealNameApender(food, randomMealName);
      MealIngredientLoader(food);
    })
    .catch((error) => {
      alert(error.message);
    });
};

// This function sets the src attribute of the provided img element to the URL of the meal's image
var MealImageApender = (food, img) => (img.src = food.strMealThumb);

// This function sets the text content of the provided element to the name of the meal
var MealNameApender = (food, name) => (name.textContent = food.strMeal);


// On reloading the page, calling the function
window.onload = () => randomMealGenerator();

// onclicking the btn to randomly generate a meal
getMealButton.onclick = () => {
  randomMealGenerator();
};

//Function to get the ingredient of the meal
// This function accepts a meal object and creates an array of its ingredients
const MealIngredientLoader = (food) => {
  const ingredientArray = []; // Initialize an empty array to hold the ingredients
  let count = 1; // Initialize a counter for the ingredient names
  while (true) { // Loop until there are no more ingredients
    const ingredient = food[`strIngredient${count}`]; // Get the name of the current ingredient
    if (!ingredient) { // If there are no more ingredients, exit the loop
      break;
    }
    ingredientArray.push(ingredient); // Add the ingredient name to the array
    count++; // Increment the counter
  }
  console.log(ingredientArray); // Print the array of ingredient names to the console (for debugging purposes)

  ingredientBox.innerHTML = ""; // Clear the ingredient box
  const heading = document.createElement("h1"); // Create a new heading element
  heading.textContent = `${food.strMeal} Ingredients`; // Set the text content of the heading to include the meal name
  ingredientBox.appendChild(heading); // Add the heading to the ingredient box
  heading.style.cssText = // Add some CSS styles to the heading
    "text-align: center; text-decoration: underline; text-underline-offset: 0.2em;";
  ingredientArray.forEach((el) => { // Loop through the array of ingredients
    const ele = document.createElement("li"); // Create a new list item element
    ele.textContent = el; // Set the text content of the list item to the ingredient name
    ingredientBox.appendChild(ele); // Add the list item to the ingredient box
  });
};

// This function is used to display the ingredients of the food when the "Get Ingredients" button is clicked
function showIngredient(food) {
  MealIngredientLoader(food);
  toggleModal();
}

// This function is used to toggle the visibility of the modal and the ingredient box
function toggleModal() {
  modal.classList.toggle("show-modal");
  ingredientBox.classList.toggle("show-ingredients");
}

// This function is used to close the modal when the user clicks anywhere outside of it
function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

// This event listener is used to display the modal and the ingredient box when the "Get Ingredients" button is clicked
getIngredientBtn.addEventListener("click", () => {
  toggleModal();
});

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 27) {
    modal.classList.remove('show-modal')
  }
})

// This event listener is used to close the modal and the ingredient box when the user clicks on the ingredient box
ingredientBox.addEventListener("click", toggleModal);

// This event listener is used to close the modal and the ingredient box when the user clicks on the close button
closeButton.addEventListener("click", toggleModal);

// This event listener is used to close the modal and the ingredient box when the user clicks anywhere outside of the modal
window.addEventListener("click", windowOnClick);

// Helper function to create the div, name, and image elements
const createResultElement = (food) => {
  const div = document.createElement("div");
  const name = document.createElement("h2");
  const image = document.createElement("img");
  MealImageApender(food, image);
  MealNameApender(food, name);
  image.addEventListener("click", () => showIngredient(food));
  div.appendChild(name);
  div.appendChild(image);
  return div;
};

const searchedMealsHeadingHandler = () => {
  searchedMealsHeading.textContent = ""
  searchedMealsHeading.textContent = `Showing the results for ${value}`
}
//Fucntion to show the results of searched in the search box

// This function searches for meals by name using the value provided as input
const searchByName = async (value) => {
  const searchByNameUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`;
  try {
    const res = await fetch(searchByNameUrl);
    // Throw an error if the response is not OK
    if (!res.ok) {
      throw new Error("Network error!");
    }
    const data = await res.json();
    // If meals are found, clear the search results div, create result elements for each meal, and append them to the div
    if (data.meals && data.meals.length > 0) {
      searchResultsDiv.innerHTML = "";
      // searchedMealsHeadingHandler()
      data.meals.forEach((food) => {
        const resultElement = createResultElement(food);
        searchResultsDiv.appendChild(resultElement);
      });
      // Scroll the search results div into view smoothly
      searchResultsDiv.scrollIntoView({ behavior: "smooth" });
    } else {
      // If no meals are found, alert the user
      alert("There is a typo error in your meal name");
    }
  } catch (error) {
    // If an error occurs, alert the user
    alert("There is no meal for for your input");
  }
};

var options = ""; // this is to store the options which will be selected by the user
const alertOptions = 'category' || 'region' // to conditionaly alert the user on which options they selected
let selectedBtn = null;

/*
 * This function is called when the user clicks on a button (either "Category" or "Region").
 * It handles toggling between the two buttons and setting/resetting the search bar placeholder text and options.
 * 
 * @param {HTMLElement} btn - The button which was clicked (either "Category" or "Region")
 * @param {string} placeholder - The placeholder text to display in the search bar when this button is selected
 * @param {string} option - The search option to use when this button is selected
 * @param {HTMLElement} otherBtn - The other button (either "Category" or "Region") 
 * @param {string} btnText - The text to display on the button when it is selected
 */
function handleBtnClick(btn, placeholder, option, otherBtn, btnText, otherBtnHandler) {

  // Check if the selected button is already the one being clicked
  if (selectedBtn === btn) {
    // If so, reset the search bar placeholder and options
    inputBox.placeholder = "Search any meal...";
    options = "";
    selectedBtn = null;
  
    // Reset the button text
    btn.innerText = btnText;
  
    // Add an event listener to the other button
    otherBtn.addEventListener("click", otherBtnHandler);


  } else {

    // If not, set the search bar placeholder and options to those for this button
    inputBox.placeholder = placeholder;
    options = option;
    selectedBtn = btn;

    // Update the button text
    btn.innerText = `Selected the ${btnText}`;

    // Remove the event listener from the other button
    otherBtn.removeEventListener("click", otherBtnHandler);

  }
}

//Calling the handler functions here,

function categoryBtnHandler() {
  handleBtnClick(
    categoryButton,
    "Search by category...",
    "c",
    areaButton,
    "category",
    areaBtnHandler
  );
}

function areaBtnHandler() {
  handleBtnClick(
    areaButton,
    "Search by region...",
    "a",
    categoryButton,
    "region",
    categoryBtnHandler
  );
}

areaButton.addEventListener("click", areaBtnHandler);
categoryButton.addEventListener("click", categoryBtnHandler);

// Search meals by category or region
const searchByOptions = async (option, value) => {
  // Construct URL for API request
  const searchByOptionsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?${option}=${value}`;

  try {
    // Make the API request
    const res = await fetch(searchByOptionsUrl);
    const data = await res.json();

    // If meals are found, display them in search results div
    if (data.meals && data.meals.length > 0) {

      searchResultsDiv.innerHTML = "";
      data.meals.forEach((food) => {
        const resultElement = createResultElement(food);
        searchResultsDiv.appendChild(resultElement);
      });
      searchResultsDiv.scrollIntoView({ behavior: "smooth" });
    } 
    // If no meals are found, display a relevant alert message
    else {
      if (option === 'c') {
        alert(`Please try to search related to ${alertOptions}`);
      } else if (option === 'r') {
        alert(`Please try to search related to ${alertOptions}`);
      }
    }
  } 
  // Catch any errors that occur during the API request
  catch (error) {
    alert("There was an error with your input");
  }
};

document.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    inputValueHandler(inputBox);
  }
});

// This function is called when the user types in the search box and hits enter or clicks the search button.
function inputValueHandler(box) {
  // The value entered by the user in the search box is stored in a variable called "searchedValue".
  var searchedValue = box.value;
  
  // If the user has selected an option from the dropdown, the "options" variable will contain the option selected.
  // In that case, call the "searchByOptions" function passing the option and searchedValue as arguments.
  // If "options" is empty, but the "searchedValue" variable contains a value, call the "searchByName" function passing searchedValue as an argument.
  // If both "options" and "searchedValue" are empty, display an alert asking the user to type something.
  options != ""
  ? searchByOptions(options, searchedValue)
  : searchedValue != ""
  ? searchByName(searchedValue)
  : alert("type something");
  }

document.getElementById("search-icon").onclick = () =>
  inputValueHandler(inputBox); //Calling the fucntion


function showOptionList(url, mainDiv) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // The response data is an object with a "meals" property that contains an array of objects
      data.meals.forEach((meal) => {
        const p = document.createElement("p");
        p.textContent = meal.strCategory || meal.strArea; // Display either the category name or region name depending on the API endpoint
        mainDiv.appendChild(p);
      });
      console.log(data);
    })
    .catch((error) => console.error(error)); // always add a catch block to handle errors
}

