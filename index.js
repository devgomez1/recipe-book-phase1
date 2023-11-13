fetch("www.themealdb.com/api/json/v1/1/categories.php")
    .then(res => res.json())
    .then(data => {
        for (let category of data) {
            renderList(category);
        }
    })

function renderList(categoryObject) {
    
}