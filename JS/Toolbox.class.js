export default class Toolbox {

    static insertAllRecipes(recipes) {
        /* Ajoute la totalité des recettes de l'application */
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
        /* Tri les recettes en fonction de la recherche de l'utilisateur */
        recipes = recipes["recipes"]
        const regex_search = RegExp(`(\\b${search_value})`)
        let sorted_recipes = []
        for (let element in recipes) {
            let name = recipes[element]["name"].toLowerCase()
            let description = recipes[element]["description"].toLowerCase()
            let ingredients = recipes[element]["ingredients"]
            // cherche si on a une correspondance dans le titre de la recette
            if (regex_search.exec(name)) {
                sorted_recipes.push(recipes[element])
                continue
            }
            // cherche si on a une correspondance dans la description de la recette
            if (regex_search.exec(description)) {
                sorted_recipes.push(recipes[element])
                continue
            }
            // cherche si on a une correspondance dans les ingrédients de la recette
            for (let i in ingredients) {
                let ingredient = ingredients[i]["ingredient"].toLowerCase()
                if (regex_search.exec(ingredient)) {
                    sorted_recipes.push(recipes[element])
                    continue
                }
            }
        }
        // supprime l'alert si déjà présente pour éviter les doublons ou en cas de recherche valide
        try {
            const recipe_alert = document.querySelector("#recipes_section .row .alert")
            recipe_alert.remove()
        }
        catch {
            console.info("code : sortRecipe()")
        }
        if (sorted_recipes.length > 0) {
            // TODO: add commentaire
            this.insertSortRecipe(sorted_recipes)
            // supprime les tags existants
            this.removeTags()
            // récupère les tags en fonction de la recherche en cours
            this.getTags(sorted_recipes)
        }
        else {
            // supprime les cartes existantes
            this.removeRecipe()
            // supprime les tags existants
            this.removeTags()
            // ajout du message "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc..."
            this.incorrectSorting()
        }
    }

    static incorrectSorting() {
        /* Ajoute une alerte */
        const recipes_section = document.querySelector("#recipes_section .row")
        let incorrect_message_html = `<div class="alert alert-danger" role="alert">
        Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc...
        </div>
        `
        recipes_section.insertAdjacentHTML("beforeend", incorrect_message_html)
    }

    static getAllTags(recipes) {
        /* Récupère tous les tags disponibles */
        let data = recipes["recipes"]
        let appliance_tags = []
        let ingredient_tags = []
        let ustensils_tags = []
        for (let element in data) {
            // répuère les tags de type appliance
            if (appliance_tags.includes(data[element].appliance)) {
                continue
            }
            else {
                appliance_tags.push(data[element].appliance)
            }
            // répuère les tags de type ingredient
            for (let i in data[element].ingredients) {
                if (ingredient_tags.includes(data[element].ingredients[i].ingredient)) {
                    continue
                }
                else {
                    ingredient_tags.push(data[element].ingredients[i].ingredient)
                }
            }
            // répuère les tags de type ustensil
            for (let a in data[element].ustensils) {
                if (ustensils_tags.includes(data[element].ustensils[a])) {
                    continue
                }
                else {
                    ustensils_tags.push(data[element].ustensils[a])
                }
            }
        }
        this.insertTags(appliance_tags, ingredient_tags, ustensils_tags)
    }

    static getTags(sorted_recipes) {
        /* TODO: add commentaire */
        let appliance_tags = []
        let ingredient_tags = []
        let ustensils_tags = []
        for (let element in sorted_recipes) {
            // répuère les tags de type appliance
            if (appliance_tags.includes(sorted_recipes[element].appliance)) {
                continue
            }
            else {
                appliance_tags.push(sorted_recipes[element].appliance)
            }
            // répuère les tags de type ingredient
            for (let i in sorted_recipes[element].ingredients) {
                if (ingredient_tags.includes(sorted_recipes[element].ingredients[i].ingredient)) {
                    continue
                }
                else {
                    ingredient_tags.push(sorted_recipes[element].ingredients[i].ingredient)
                }
            }
            // répuère les tags de type ustensil
            for (let a in sorted_recipes[element].ustensils) {
                if (ustensils_tags.includes(sorted_recipes[element].ustensils[a])) {
                    continue
                }
                else {
                    ustensils_tags.push(sorted_recipes[element].ustensils[a])
                }
            }
        }
        this.insertTags(appliance_tags, ingredient_tags, ustensils_tags)
    }

    static insertTags(appliance_tags, ingredient_tags, ustensils_tags) {
        /* Ajoute la totalité des tags de l'application */
        const appareil_ul = document.getElementById("appareil")
        const ingredients_ul = document.getElementById("ingredients")
        const ustensiles_ul = document.getElementById("ustensiles")
        let appliance_tags_html = ""
        let ingredient_tags_html = ""
        let ustensils_tags_html = ""
        for (let element in appliance_tags) {
            let tag_html = `<li><a class="text-light" href="#">${appliance_tags[element]}</a></li>`
            appliance_tags_html += tag_html
        }
        for (let element in ingredient_tags) {
            let tag_html = `<li><a class="text-light" href="#">${ingredient_tags[element]}</a></li>`
            ingredient_tags_html += tag_html
        }
        for (let element in ustensils_tags) {
            let tag_html = `<li><a class="text-light" href="#">${ustensils_tags[element]}</a></li>`
            ustensils_tags_html += tag_html
        }
        ingredients_ul.insertAdjacentHTML("beforeend", ingredient_tags_html);
        appareil_ul.insertAdjacentHTML("beforeend", appliance_tags_html);
        ustensiles_ul.insertAdjacentHTML("beforeend", ustensils_tags_html);
    }

    static sortTags(type, search_value) {
        /* TODO: add commentaire */
        const regex_tags = RegExp(">(...{0,})<")
        let current_tags = []
        if (type == "ingredient") {
            current_tags = this.getCurrentIngredientTags(regex_tags)
        }
        else if (type == "appliance") {
            current_tags = this.getCurrentApplianceTags(regex_tags)
        }
        else if (type == "ustensil") {
            current_tags = this.getCurrentUstensilTags(regex_tags)
        }
        console.log("current_tags :", current_tags)
    }

    static getCurrentIngredientTags(regex_tags) {
        /* TODO: add commentaire */
        const ingredients_li = document.querySelectorAll("#ingredients li")
        let current_ingredient = []
        for (let element in ingredients_li) {
            if (ingredients_li[element].innerHTML != undefined) {
                current_ingredient.push(regex_tags.exec(ingredients_li[element].innerHTML)[1])
            }
        }
        return current_ingredient
    }

    static getCurrentApplianceTags(regex_tags) {
        /* TODO: add commentaire */
        const appliance_li = document.querySelectorAll("#appareil li")
        let current_appliance = []
        for (let element in appliance_li) {
            if (appliance_li[element].innerHTML != undefined) {
                current_appliance.push(regex_tags.exec(appliance_li[element].innerHTML)[1])
            }
        }
        return current_appliance
    }

    static getCurrentUstensilTags(regex_tags) {
        /* TODO: add commentaire */
        const ustensils_li = document.querySelectorAll("#ustensiles li")
        let current_ustensil = []
        for (let element in ustensils_li) {
            if (ustensils_li[element].innerHTML != undefined) {
                current_ustensil.push(regex_tags.exec(ustensils_li[element].innerHTML)[1])
            }
        }
        return current_ustensil
    }

    static insertSortRecipe(sorted_recipes) {
        /* Ajoute les recettes correspondantes à la recherche */
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
        /* Supprime les recettes */
        try {
            const recipe_cards = document.querySelectorAll("#recipes_section .row .col-xl-4")
            for (let element in recipe_cards) {
                recipe_cards[element].remove()
            }
        }
        catch {
            console.info("code : removeRecipe()")
        }
    }

    static removeTags() {
        /* Supprime les tags */
        console.log("On passe bien dans remove tags!!")
        try {
            const filters = document.querySelectorAll(".filters li")
            for (let element in filters) {
                filters[element].remove()
            }
        }
        catch {
            console.info("code : removeTags()")
        }
    }
}