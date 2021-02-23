// imports
import TagsToolbox from "./Tags_Toolbox.class.js"

export default class RecipesToolbox {

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

    static sortRecipe(recipes, search_value) {
        /* Tri les recettes en fonction de la recherche de l'utilisateur et du nombre de correspondance pour avoir une recherche plus précise */
        const regex_search = RegExp(`(\\b${search_value})`)
        let sorted_recipes = []
        let correspondence_lvl_1 = []
        let correspondence_lvl_2 = []
        let correspondence_lvl_3 = []
        let correspondence_lvl_4 = []
        for (let element in recipes) {
            let correspondence = 0
            let name = recipes[element]["name"].toLowerCase()
            let description = recipes[element]["description"].toLowerCase()
            let ingredients = recipes[element]["ingredients"]
            // cherche si on a une correspondance dans le titre de la recette
            if (name.search(regex_search) != -1) {
                correspondence ++
            }
            // cherche si on a une correspondance dans la description de la recette
            if (description.search(regex_search) != -1) {
                correspondence ++
            }
            // cherche si on a une correspondance dans les ingrédients de la recette
            for (let i in ingredients) {
                let ingredient = ingredients[i]["ingredient"].toLowerCase()
                if (ingredient.search(regex_search) != -1) {
                    correspondence ++
                }
            }
            // ajoute la recette à la liste correspondant au niveau de correspondance dans de la recherche principale
            if (correspondence == 1) {
                correspondence_lvl_1.push(recipes[element])
            }
            else if (correspondence == 2) {
                correspondence_lvl_2.push(recipes[element])
            }
            else if (correspondence == 3) {
                correspondence_lvl_3.push(recipes[element])
            }
            else if (correspondence > 3) {
                correspondence_lvl_4.push(recipes[element])
            }
            else {
                continue
            }
        }
        for (let element in correspondence_lvl_4) {
            sorted_recipes.push(correspondence_lvl_4[element])
        }
        for (let element in correspondence_lvl_3) {
            sorted_recipes.push(correspondence_lvl_3[element])
        }
        for (let element in correspondence_lvl_2) {
            sorted_recipes.push(correspondence_lvl_2[element])
        }
        for (let element in correspondence_lvl_1) {
            sorted_recipes.push(correspondence_lvl_1[element])
        }
        // supprime l'alert si déjà présente pour éviter les doublons ou en cas de recherche valide
        try {
            const recipe_alert = document.querySelector("#recipes_section .row .alert")
            // supprime l'alert si existante
            recipe_alert.remove()
        }
        catch {
            console.info("code : sortRecipe()")
        }
        if (sorted_recipes.length > 0) {
            // ajoute les recettes après recherche
            this.insertSortRecipe(sorted_recipes)
            // supprime les tags existants
            TagsToolbox.removeTags()
            // récupère les tags en fonction de la recherche en cours
            TagsToolbox.getTags(sorted_recipes)
            // update les tags
            this.sortRecipeAfterTag(sorted_recipes)
        }
        else {
            // supprime les cartes existantes
            this.removeRecipe()
            // supprime les tags existants
            TagsToolbox.removeTags()
            // ajout du message "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc..."
            this.incorrectSorting()
        }
    }

    static sortRecipeAfterTag(recipes) {
        /* Actualise les tags après une recherche ou l'ajout d'un tag */
        let tags_list = TagsToolbox.getTagsAdded()
        const card_title = document.querySelectorAll(".card-title")
        const cards = document.querySelectorAll(".col-xl-4")
        let current_recipes = []
        let current_cards = []
        let all_sorted_recipes = []
        let remove_recipes = []
        let sorted_recipes = []
        for (let element in card_title) {
            if (card_title[element].innerText != undefined) {
                current_recipes.push(card_title[element])
                current_cards.push(cards[element])
            }
        }
        for (let element in recipes) {
            let name = recipes[element]["name"].toLowerCase()
            let appareil = recipes[element]["appliance"].toLowerCase()
            let ustensiles = recipes[element]["ustensils"]
            let ingredients = recipes[element]["ingredients"]
            let flag_list = []
            for (let i in tags_list) {
                let flag = false
                const regex_tag = RegExp(`(\\b${tags_list[i].toLowerCase()})`)
                // cherche si on a une correspondance dans le titre de la recette
                if (regex_tag.exec(name)) {
                    flag = true
                    continue
                }
                // cherche si on a une correspondance dans la description de la recette
                if (regex_tag.exec(appareil)) {
                    flag = true
                    continue
                }
                // cherche si on a une correspondance dans les ustensiles de la recette
                for (let f in ustensiles) {
                    let ustensile = ustensiles[f].toLowerCase()
                    if (regex_tag.exec(ustensile)) {
                        flag = true
                        continue
                    }
                }
                // cherche si on a une correspondance dans les ingrédients de la recette
                for (let a in recipes[element]["ingredients"]) {
                    let ingredient = ingredients[a]["ingredient"].toLowerCase()
                    if (regex_tag.exec(ingredient)) {
                        flag = true
                        continue
                    }
                }
                flag_list.push(flag)
            }
            // ajoute la recette si tous les tags sont compatibles avec celle-ci
            if (flag_list.includes(false)) {
                continue
            }
            else {
                all_sorted_recipes.push(name)
                sorted_recipes.push(recipes[element])
            }
        }
        for (let element in current_recipes) {
            let current_recipes_name = current_recipes[element].innerText.toLowerCase()
            if (all_sorted_recipes.includes(current_recipes_name)) {
                continue
            }
            else {
                remove_recipes.push(current_cards[element])
            }
        }
        for (let element in remove_recipes) {
            remove_recipes[element].remove()
        }
        // supprime les tags existants
        TagsToolbox.removeTags()
        // récupère les tags en fonction de la recherche en cours
        TagsToolbox.getTags(sorted_recipes)
        // rafraichi le DOM pour les nouveaux tags
        TagsToolbox.clickOnAllTags(recipes)
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

    static activeDropdown(type, btn) {
        /* Active les dropdown */
        let active_class = "col-xl-6"
        let inactive_class = "col-xl-2"
        const dropdown = document.getElementById(`${type}_section`)
        const tags_ul = document.getElementById(`${type}`)
        if (dropdown.className == inactive_class) {
            dropdown.setAttribute("class", active_class)
            tags_ul.style.display = "flex"
            btn.innerHTML = `<i class="fas fa-chevron-up"></i>`
        }
        else if (dropdown.className == active_class) {
            dropdown.setAttribute("class", inactive_class)
            tags_ul.style.display = "none"
            btn.innerHTML = `<i class="fas fa-chevron-down"></i>`
        }
    }
}