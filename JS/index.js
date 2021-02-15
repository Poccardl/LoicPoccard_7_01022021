// imports
import Recipe from "./Recipe.class.js"
import Toolbox from "./Toolbox.class.js"

fetchData()

function fetchData() {
    /* Récupère les données des différentes recettes dans le fichier "recipes.json" */
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
    Toolbox.insertAllRecipes(recipes)
    Toolbox.getAllTags(recipes)

    const regex_tags = RegExp(">(...{0,})<")
    // récupère les tags après la recherche principale
    let current_ingredient_tags = Toolbox.getCurrentIngredientTags(regex_tags)
    let current_appliancet_ags = Toolbox.getCurrentApplianceTags(regex_tags)
    let current_ustensil_tags = Toolbox.getCurrentUstensilTags(regex_tags)

    // DOM elements
    const search_bar = document.getElementById("search_bar")
    const search_ingredients = document.getElementById("search_ingredients")
    const search_appareil = document.getElementById("search_appareil")
    const search_ustensiles = document.getElementById("search_ustensiles")
    const ingredients_btn = document.getElementById("ingredients_btn")
    const appareil_btn = document.getElementById("appareil_btn")
    const ustensiles_btn = document.getElementById("ustensiles_btn")

    // events
    search_bar.addEventListener("input", (e) => {
        let search_value = e.target.value
        // lance la recherche à partir de 3 caractère
        if (search_value.length >= 3) {
            Toolbox.sortRecipe(recipes, search_value.toLowerCase())
        }
        // récupère les tags après la mise à jour de la recherche principale
        current_ingredient_tags = Toolbox.getCurrentIngredientTags(regex_tags)
        current_appliancet_ags = Toolbox.getCurrentApplianceTags(regex_tags)
        current_ustensil_tags = Toolbox.getCurrentUstensilTags(regex_tags)
    })
    // TODO: add commentaire
    search_ingredients.addEventListener("input", (e) => {
        Toolbox.sortTags("ingredient", e.target.value.toLowerCase(), current_ingredient_tags)
    })
    search_appareil.addEventListener("input", (e) => {
        Toolbox.sortTags("appliance", e.target.value.toLowerCase(), current_appliancet_ags)
    })
    search_ustensiles.addEventListener("input", (e) => {
        Toolbox.sortTags("ustensil", e.target.value.toLowerCase(), current_ustensil_tags)
    })
    // TODO: add commentaire
    ingredients_btn.addEventListener("click", () => {
        Toolbox.activeDropdown("ingredients", ingredients_btn)
    })
    appareil_btn.addEventListener("click", () => {
        Toolbox.activeDropdown("appareil", appareil_btn)
    })
    ustensiles_btn.addEventListener("click", () => {
        Toolbox.activeDropdown("ustensiles", ustensiles_btn)
    })
}