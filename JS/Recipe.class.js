// imports
import Recipes from "./Recipes.class.js"

export default class Recipe {
    constructor(recipes) {
        this.id = recipes.id;
        this.name = recipes.name;
        this.servings = recipes.servings;
        this.ingredients = recipes.ingredients;
        this.time = recipes.time;
        this.description = recipes.description;
        this.appliance = recipes.appliance;
        this.ustensils = recipes.ustensils;
    }

    static createRecipeObjList(recipes_obj_list) {
        let recipes = new Recipes(recipes_obj_list)
        return recipes
    }
}