// imports
import Recipe from "./Recipe.class.js"
import Toolbox from "./Toolbox.class.js"

fetchData()

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
        let recipes = Recipe.createRecipeObjList(recipes_obj_list)
        scenario(recipes)
    })
}

function scenario(recipes) {
    /* TODO: add commentaire */
    Toolbox.insertAllRecipe(recipes)

    // DOM Elements
    const search_bar = document.getElementById("search_bar")

    // Events
    search_bar.addEventListener("input", (e) => {
        let search_value = e.target.value
        //lance la recherche à partir de 3 caractère
        if (search_value.length >= 3) {
            Toolbox.sortRecipe(recipes, search_value.toLowerCase())
        }
    })
}