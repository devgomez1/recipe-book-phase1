let button = document.querySelector("#mealsearch");
button.addEventListener("submit", renderSearch);

function renderSearch(e) {
    e.preventDefault();
    let search = toTitleCase(e.target["meal"].value);

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.meals && data.meals.length > 0) {
                const firstMeal = data.meals[0];
                if (firstMeal.strMeal === search) {
                    //ADDING FOUND MEAL TO PAGE
                    let allKeys = Object.keys(firstMeal);

                    let foodTitle = document.querySelector("#searchname");
                    foodTitle.textContent = search;

                    for (let key of allKeys) {
                        if (key) {
                            let instruction = document.createElement("p");
                            instruction.textContent = firstMeal[key];
                            foodTitle.append(instruction);
                        }
                    }
                    
                

                    //ADDING FOUND MEAL TO PAGE
                } else {
                    console.log("Not found");
                }
            } else {
                console.log("No meals found");
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    button.reset();


}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
