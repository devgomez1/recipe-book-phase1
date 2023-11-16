let button = document.querySelector("#mealsearch");
button.addEventListener("submit", renderSearch);

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
  let saveButton = document.querySelector("#save-recipe");
  saveButton.addEventListener("click", saveRecipe);

  let container = document.getElementById("container");
  container.textContent = meal.strInstructions;

  let name = document.getElementById("main-title");
  name.textContent = meal.strMeal;

  let image = document.getElementById("thumbnail");
  image.src = meal.strMealThumb;
  image.title = "Double Click For Random Meal!";

  document.body.style.backgroundImage = `url(${meal.strMealThumb})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";

  image.addEventListener("dblclick", function () {
    if (doubleClickEnabled) {
      fetchRandomMeal();
    }
  });

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
  viewCategories.style.display = "none";

  category.addEventListener("click", function () {
    viewCategories.style.display = "";

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
