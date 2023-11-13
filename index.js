<<<<<<< HEAD

=======
let button = document.querySelector("#mealsearch");
button.addEventListener("submit", renderSearch);

function renderSearch(e) {
    e.preventDefault();
    let search = toTitleCase(e.target["meal"].value);
    
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.strMeal === search) {
                console.log("Found");
            }
        })

    button.reset();
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
>>>>>>> c1dc1f69cc6140e7a55b04f22210f55604a7c896
