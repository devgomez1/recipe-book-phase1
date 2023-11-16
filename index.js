let selectedFoodItem = null;
let doubleClickEnabled = true; // Added flag to control double-click


//BUTTON TEST 
let categoriesContainer = document.querySelector("#categories");

let viewCategories = document.createElement("button");
viewCategories.textContent = "View Categories"

categoriesContainer.append(viewCategories);

viewCategories.addEventListener("click", function(){
    let foodList = document.querySelector("#specific-foods");
    foodList.style.display = "none";
    viewCategories.style.display = "none"


    let list = document.querySelector("#each-category");
    list.style.display = "";

})

//BUTTON TEST 

document.addEventListener("DOMContentLoaded", fetchRandomMeal);

function fetchRandomMeal() {
  // Disable double-click during the fetch
  doubleClickEnabled = false;

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const randomMeal = data.meals[0];
      renderMeal(randomMeal);
    })
    .finally(() => {
      // Enable double-click after the fetch is complete
      doubleClickEnabled = true;
    });
}

let form = document.querySelector("#mealsearch");
form.addEventListener("submit", renderSearch);

function renderSearch(e) {
  e.preventDefault();
  let search = toTitleCase(e.target["meal"].value);

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.meals && data.meals.length > 0) {
        renderMeal(data.meals[0]);
      } else {
        console.log("No meals found");
      }
    });

  form.reset();
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

function renderMeal(meal) {
     // SAVE BUTTON CODE //
    let saveButton = document.querySelector("#save-recipe");
    saveButton.addEventListener("click", saveRecipe)

    // SAVE BUTTON CODE //
  let container = document.getElementById("container");
  container.textContent = meal.strInstructions;

  let name = document.getElementById("main-title");
  name.textContent = meal.strMeal;

  let image = document.getElementById("thumbnail");
  image.src = meal.strMealThumb;
  // 11/16 ADD
  image.title = "Double click for random meal!";
  // 11/16 ADD

  document.body.style.backgroundImage = `url(${meal.strMealThumb})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";

  image.addEventListener("dblclick", function () {
    // Check if double-click is enabled
    if (doubleClickEnabled) {
      fetchRandomMeal();
    }
  });

  

  // New code to append ingredients and measurements
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `${ingredient}: ${measure}, `;
    }
  }

  ingredientsList = ingredientsList.slice(0, -2);

  let ingredientsElement = document.createElement("p");
  ingredientsElement.textContent = ingredientsList;
  container.appendChild(ingredientsElement);
}

fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((res) => res.json())
  .then((data) => {
    data.categories.forEach((category) => {
      console.log(category);
      renderCategories(category);
    });
  });

function renderCategories(categoryObject) {
  let categoriesContainer = document.querySelector("#each-category");
  let category = document.createElement("li");
  category.textContent = categoryObject.strCategory;
  categoriesContainer.append(category);
  viewCategories.style.display = "none"

  category.addEventListener("click", function () {
    viewCategories.style.display = ""
    
    renderCategoryList(categoryObject);
    let list = document.querySelector("#each-category");
    list.style.display = "none";

    let foodList = document.querySelector("#specific-foods");
    foodList.style.display = "";
  });
}

function renderCategoryList(categoryObject) {
  let category = categoryObject.strCategory;
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
      data.meals.forEach((meal) => {
        renderCategoryMeals(meal);
        console.log(meal);
        console.log(data);
      });
    });
}

function renderCategoryMeals(categoryObject) {
  let foodList = document.querySelector("#specific-foods");
  let mealOption = document.createElement("li");
  mealOption.textContent = categoryObject.strMeal;
  foodList.append(mealOption);

  let selectedFoodItem = categoryObject.strMeal;
  console.log(selectedFoodItem);

  mealOption.addEventListener("click", function () {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${selectedFoodItem}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.meals && data.meals.length > 0) {
          renderMeal(data.meals[0]);
        } else {
          console.log("No meals found");
        }
      });
  });
}

function saveRecipe() {
  let savedList = document.querySelector("#saved-items");
  let newSave = document.querySelector("#main-title");
  let newSaveName = newSave.textContent;

  //SAVE IMAGE NEW LINE//
  let savedImage = document.querySelector("#thumbnail");
  //SAVE IMAGE NEW LINE//

  if (!isSaved(newSaveName)) {
    let addToList = document.createElement("li");
    addToList.textContent = newSaveName;
    addToList.className = "savedLi";
    addToList.title = "Double click to delete!"
    savedList.append(addToList);

    //SAVE IMAGE NEW LINE//
    let savedImageUrl = savedImage.src;
    let addImage = document.createElement("img");
    addImage.className = "saved-images"
    addImage.src = savedImageUrl;
    addToList.append(addImage);
    //SAVE IMAGE NEW LINE//

    addToList.addEventListener("dblclick", function () {
      addToList.remove();
    });
    addToList.addEventListener("click", function () {
      let search = toTitleCase(newSaveName);

      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.meals && data.meals.length > 0) {
            renderMeal(data.meals[0]);
          } else {
            console.log("No meals found");
          }
        });
      form.reset();
    });
  } else {
    alert("Already saved!");
  }
}

function isSaved(itemName) {
    let savedList = document.querySelector("#saved-items");
    let savedItems = savedList.querySelectorAll("li");
    for (let savedItem of savedItems) {
        if (savedItem.textContent === itemName) {
            return true;
        }
    }
    return false;
}













