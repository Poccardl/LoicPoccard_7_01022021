export default class Toolbox {

    static insertAllRecipe(recipes) {
        /* TODO: add commentaire */
        const recipes_section = document.querySelector("#recipes_section .row")
        let data = recipes["recipes"]
        let recipe_cards = []
        for (let element in data) {
            let recipe_card_html = `<div class="col-xl-4 mt-4">
            <div class="card">
            <img src="img/recette_proto.png" class="card-img-top" alt="image test">
            <div class="card-body">
            <div class="card_header">
            <h5 class="card-title">${data[element]["name"]}</h5>
            <span class="time">
            <i class="far fa-clock"></i>
            <b>&#160;${data[element]["time"]} min</b>
            </span>
            </div>
            <div class="card_content">
            <ul class="element">
            `
            let ingredients = data[element]["ingredients"]
            let recipe_ingredients_html = ""
            for (let i in ingredients) {
                recipe_ingredients_html += `<li><b>${ingredients[i]["ingredient"]}</b>: `
                if (ingredients[i]["quantity"]) {
                    recipe_ingredients_html += ingredients[i]["quantity"]
                }
                if (ingredients[i]["unit"]) {
                    recipe_ingredients_html += ingredients[i]["unit"]
                }
                else {
                    continue
                }
                recipe_ingredients_html += `</li>`

            }
            recipe_card_html += `${recipe_ingredients_html}
            </ul>
            <p class="card-text element">${data[element]["description"]}</p>
            </div>
            </div>
            </div>
            </div>
            `
            recipe_cards.push(recipe_card_html)
        }
        for (let element in recipe_cards) {
            recipes_section.insertAdjacentHTML("beforeend", recipe_cards[element]);
        }
    }

    static sortRecipe(recipes, search_value) {
        /* TODO: add commentaire */
        console.log("data", recipes)
        console.log("search_value", search_value)
        recipes = recipes["recipes"]
        const regex_search = RegExp(`(\\b${search_value}\\b)`)
        let sorted_recipes = []

        for (let element in recipes) {
            let name = recipes[element]["name"].toLowerCase()
            let description = recipes[element]["description"].toLowerCase()
            let ingredients = recipes[element]["ingredients"]
            // cherche si on a une correspondance dans le titre de la recette
            if (regex_search.exec(name)) {
                console.log("match name :", recipes[element]["name"])
                sorted_recipes.push(recipes[element])
                continue
            }
            // cherche si on a une correspondance dans la description de la recette
            if (regex_search.exec(description)) {
                console.log("match description :", recipes[element]["description"])
                sorted_recipes.push(recipes[element])
                continue
            }
            // cherche si on a une correspondance dans les ingrédients de la recette
            for (let i in ingredients) {
                let ingredient = ingredients[i]["ingredient"].toLowerCase()
                if (regex_search.exec(ingredient)) {
                    console.log("match ingredient :", ingredients[i]["ingredient"])
                    sorted_recipes.push(recipes[element])
                    continue
                }
            }
        }
        if (sorted_recipes.length > 0) {
            this.sortTagRecipe(sorted_recipes)
        }
    }

    static sortTagRecipe(sorted_recipes) {
        /* TODO: add commentaire */
        this.insertSortRecipe(sorted_recipes)
    }

    static insertSortRecipe(sorted_recipes) {
        /* TODO: add commentaire */
        // supprime les cartes existantes avant d'ajouter les nouvelles
        this.removeRecipe()
        const recipes_section = document.querySelector("#recipes_section .row")
        let recipe_cards = []
        for (let element in sorted_recipes) {
            let recipe_card_html = `<div class="col-xl-4 mt-4">
            <div class="card">
            <img src="img/recette_proto.png" class="card-img-top" alt="image test">
            <div class="card-body">
            <div class="card_header">
            <h5 class="card-title">${sorted_recipes[element]["name"]}</h5>
            <span class="time">
            <i class="far fa-clock"></i>
            <b>&#160;${sorted_recipes[element]["time"]} min</b>
            </span>
            </div>
            <div class="card_content">
            <ul class="element">
            `
            let ingredients = sorted_recipes[element]["ingredients"]
            let recipe_ingredients_html = ""
            for (let i in ingredients) {
                recipe_ingredients_html += `<li><b>${ingredients[i]["ingredient"]}</b>: `
                if (ingredients[i]["quantity"]) {
                    recipe_ingredients_html += ingredients[i]["quantity"]
                }
                if (ingredients[i]["unit"]) {
                    recipe_ingredients_html += ingredients[i]["unit"]
                }
                else {
                    continue
                }
                recipe_ingredients_html += `</li>`

            }
            recipe_card_html += `${recipe_ingredients_html}
            </ul>
            <p class="card-text element">${sorted_recipes[element]["description"]}</p>
            </div>
            </div>
            </div>
            </div>
            `
            recipe_cards.push(recipe_card_html)
        }
        for (let element in recipe_cards) {
            recipes_section.insertAdjacentHTML("beforeend", recipe_cards[element]);
        }
    }

    static removeRecipe() {
        /* TODO: add commentaire */
        try {
            const recipe_cards = document.querySelectorAll("#recipes_section .row .col-xl-4")
            for (let element in recipe_cards) {
                recipe_cards[element].remove()
            }
        }
        catch {
            //TODO: add error
        }
    }
}