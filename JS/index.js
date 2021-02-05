// imports
import Recipe from "./Recipe.class.js"

fetchData()

// DOM Elements
const search_bar = document.getElementById("search_bar")

// Events
search_bar.addEventListener("input", (e) => {
    let search_value = e.target.value
    if (search_value.length >= 3) {
        //lance la recherche à partir de 3 caractère
    }
})

function fetchData() {
    /* TODO: add commentaire */
    fetch("data/recipes.json")
    .then(function(resp) {
        return resp.json()
    })
    .then(function(data) {
        let recipes_obj_list = []
        for (let element in data["recipes"]) {
            let recipe_obj = new Recipe(data["recipes"][element])
            recipes_obj_list.push(recipe_obj)
        }
        Recipe.insertAllRecipe(recipes_obj_list)
    })
}