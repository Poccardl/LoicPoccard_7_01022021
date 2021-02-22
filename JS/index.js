// imports
import Recipe from "./Recipe.class.js"
import RecipesToolbox from "./Recipes_Toolbox.class.js"
import TagsToolbox from "./Tags_Toolbox.class.js"

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
    RecipesToolbox.insertAllRecipes(recipes)
    TagsToolbox.getAllTags(recipes)
    TagsToolbox.clickOnAllTags(recipes["recipes"])

    const regex_tags = RegExp(">(...{0,})<")
    // récupère les tags après la recherche principale
    let current_ingredient_tags = TagsToolbox.getCurrentIngredientTags(regex_tags)
    let current_appliancet_ags = TagsToolbox.getCurrentApplianceTags(regex_tags)
    let current_ustensil_tags = TagsToolbox.getCurrentUstensilTags(regex_tags)

    // DOM elements
    const search_bar = document.getElementById("search_bar")
    const search_ingredients = document.getElementById("search_ingredients")
    const search_appareil = document.getElementById("search_appareil")
    const search_ustensiles = document.getElementById("search_ustensiles")
    const ingredients_btn = document.getElementById("ingredients_btn")
    const appareil_btn = document.getElementById("appareil_btn")
    const ustensiles_btn = document.getElementById("ustensiles_btn")

    // events
    // créer un EventListener lors d'un input dans la barre de recherche principale
    search_bar.addEventListener("input", (e) => {
        let search_value = e.target.value
        // lance la recherche à partir de 3 caractère
        if (search_value.length >= 3) {
            RecipesToolbox.sortRecipe(recipes, search_value.toLowerCase())
        }
        // récupère les tags après la mise à jour de la recherche principale
        current_ingredient_tags = TagsToolbox.getCurrentIngredientTags(regex_tags)
        current_appliancet_ags = TagsToolbox.getCurrentApplianceTags(regex_tags)
        current_ustensil_tags = TagsToolbox.getCurrentUstensilTags(regex_tags)
    })
    // créer un EventListener lors d'un input dans l'une des barres de recherche des tags
    search_ingredients.addEventListener("input", (e) => {
        TagsToolbox.sortTags("ingredient", e.target.value.toLowerCase(), current_ingredient_tags)
        TagsToolbox.clickOnIngredientsTags(recipes["recipes"])
    })
    search_appareil.addEventListener("input", (e) => {
        TagsToolbox.sortTags("appliance", e.target.value.toLowerCase(), current_appliancet_ags)
        TagsToolbox.clickOnAppareilTags(recipes["recipes"])
    })
    search_ustensiles.addEventListener("input", (e) => {
        TagsToolbox.sortTags("ustensil", e.target.value.toLowerCase(), current_ustensil_tags)
        TagsToolbox.clickOnUstensilesTags(recipes["recipes"])
    })
    // ouvre, ferme les dropdown des différents tags
    ingredients_btn.addEventListener("click", () => {
        RecipesToolbox.activeDropdown("ingredients", ingredients_btn)
    })
    appareil_btn.addEventListener("click", () => {
        RecipesToolbox.activeDropdown("appareil", appareil_btn)
    })
    ustensiles_btn.addEventListener("click", () => {
        RecipesToolbox.activeDropdown("ustensiles", ustensiles_btn)
    })
}