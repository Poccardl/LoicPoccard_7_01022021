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
            //TODO: add commentaire
            this.sortRecipeAfterTag(sorted_recipes)
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

    static sortRecipeAfterTag(recipes) {
        /* TODO: add commentaire */
        let tags_list = this.getTagsAdded()
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
        console.log("current_recipes :", current_recipes)

        if (tags_list.length > 0) {
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
                // Ajoute la recette si tous les tags sont compatibles avec celle-ci
                if (flag_list.includes(false)) {
                    continue
                }
                else {
                    all_sorted_recipes.push(name)
                    sorted_recipes.push(recipes[element])
                }
            }
            console.log("all_sorted_recipes ::", all_sorted_recipes)

            for (let element in current_recipes) {
                let current_recipes_name = current_recipes[element].innerText.toLowerCase()
                if (all_sorted_recipes.includes(current_recipes_name)) {
                    continue
                }
                else {
                    remove_recipes.push(current_cards[element])
                }
            }
            console.log("remove_recipes :", remove_recipes)

            for (let element in remove_recipes) {
                remove_recipes[element].remove()
            }
            // TODO: faire une update des Tags disponibles...
            // supprime les tags existants
            this.removeTags()
            // récupère les tags en fonction de la recherche en cours
            this.getTags(sorted_recipes)
            // TODO: add commentaire
            this.clickOnAllTags(recipes)
        }
    }

    static getTagsAdded() {
        /* TODO: add commentaire */
        const tag = document.querySelectorAll(".tag")
        let tags_list = []
        try {
            for (let element in tag) {
                if (tag[element].innerText != undefined) {
                    tags_list.push(tag[element].innerText.slice(0, -1).toLowerCase())
                }
            }
        }
        catch {
            console.info("code : getTagAdded()")
        }
        console.log("tags_list", tags_list)
        return tags_list
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
        /* Récupère tous les tags disponibles lors de la première initialisation de l'application */
        let data = recipes["recipes"]
        let appliance_tags = []
        let ingredient_tags = []
        let ustensils_tags = []
        for (let element in data) {
            // récupère les tags de type appliance
            if (appliance_tags.includes(data[element].appliance)) {
                continue
            }
            else {
                appliance_tags.push(data[element].appliance)
            }
            // récupère les tags de type ingredient
            for (let i in data[element].ingredients) {
                if (ingredient_tags.includes(data[element].ingredients[i].ingredient)) {
                    continue
                }
                else {
                    ingredient_tags.push(data[element].ingredients[i].ingredient)
                }
            }
            // récupère les tags de type ustensil
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
        console.log("sorted_recipes////", sorted_recipes)
        /* Récupère la totalité des tags de l'application en fonction de la recherche principale, par tags */
        let appliance_tags = []
        let ingredient_tags = []
        let ustensils_tags = []
        for (let element in sorted_recipes) {
            // récupère les tags de type appliance
            if (appliance_tags.includes(sorted_recipes[element].appliance)) {
                continue
            }
            else {
                appliance_tags.push(sorted_recipes[element].appliance)
            }
            // récupère les tags de type ingredient
            for (let i in sorted_recipes[element].ingredients) {
                if (ingredient_tags.includes(sorted_recipes[element].ingredients[i].ingredient)) {
                    continue
                }
                else {
                    ingredient_tags.push(sorted_recipes[element].ingredients[i].ingredient)
                }
            }
            // récupère les tags de type ustensil
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
        /* Ajoute la totalité des tags de l'application en fonction de la recherche principale */
        const ingredients_ul = document.getElementById("ingredients")
        const appareil_ul = document.getElementById("appareil")
        const ustensiles_ul = document.getElementById("ustensiles")
        let appliance_tags_html = ""
        let ingredient_tags_html = ""
        let ustensils_tags_html = ""
        for (let element in appliance_tags) {
            let tag_html = `<li><a class="dropdown-item text-light" href="#">${appliance_tags[element]}</a></li>`
            appliance_tags_html += tag_html
        }
        for (let element in ingredient_tags) {
            let tag_html = `<li><a class="dropdown-item text-light" href="#">${ingredient_tags[element]}</a></li>`
            ingredient_tags_html += tag_html
        }
        for (let element in ustensils_tags) {
            let tag_html = `<li><a class="dropdown-item text-light" href="#">${ustensils_tags[element]}</a></li>`
            ustensils_tags_html += tag_html
        }
        ingredients_ul.insertAdjacentHTML("beforeend", ingredient_tags_html);
        appareil_ul.insertAdjacentHTML("beforeend", appliance_tags_html);
        ustensiles_ul.insertAdjacentHTML("beforeend", ustensils_tags_html);
    }

    static sortTags(type, search_value, current_tags) {
        /* Tri les tags en fonction de la recherche de l'utilisateur */
        const regex_search = RegExp(`(\\b${search_value})`)
        let sorted_tags = []
        for (let element in current_tags) {
            if (regex_search.exec(current_tags[element].toLowerCase())) {
                sorted_tags.push(current_tags[element])
            }
        }
        this.insertCurrentTags(type, sorted_tags)
    }

    static insertCurrentTags(type, sorted_tags) {
        /* Ajoute les tags correspondants à la recherche */
        let node = ""
        let current_tags_html = ""
        if (type == "ingredient") {
            node = "ingredients"
        }
        else if (type == "appliance") {
            node = "appareil"
        }
        else if (type == "ustensil") {
            node = "ustensiles"
        }
        // récupère le bon node en fonction du type de tag
        const tags_ul = document.getElementById(`${node}`)
        for (let element in sorted_tags) {
            current_tags_html += `<li><a class="dropdown-item text-light" href="#">${sorted_tags[element]}</a></li>`
        }
        // supprime les anciens tags avant d'ajouter les nouveaux
        this.removeCurrentTags(node)
        tags_ul.insertAdjacentHTML("beforeend", current_tags_html)
    }

    static getCurrentIngredientTags(regex_tags) {
        /* Récupère les tags de type "ingredients" actuelles */
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
        /* Récupère les tags de type "appareil" actuelles */
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
        /* Récupère les tags de type "ustensiles" actuelles */
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

    static removeCurrentTags(node) {
        /* Supprime les tags actuelles en fonction d'un type donner */
        const tags_li = document.querySelectorAll(`#${node} li`)
        for (let element in tags_li) {
            try {
                tags_li[element].remove()
            }
            catch {
                console.info("code : removeCurrentTags()")
            }
        }

    }

    static activeDropdown(type, btn) {
        /* TODO: add commentaire */
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

    static clickOnAllTags(recipes) {
        /* TODO: add commentaire */
        this.clickOnIngredientsTags(recipes)
        this.clickOnAppareilTags(recipes)
        this.clickOnUstensilesTags(recipes)
    }

    static clickOnIngredientsTags(recipes) {
        /* TODO: add commentaire */
        const ingredients_tags = document.querySelectorAll("#ingredients li")
        let type = "ingredients"
        let data = ""
        for (let element in ingredients_tags) {
            try {
                ingredients_tags[element].addEventListener("click", () => {
                    data = ingredients_tags[element].innerText
                    this.addTag(recipes, type, data)
                })
            } catch {
                console.info("code : clickOnIngredientsTags()")
            }
        }
    }

    static clickOnAppareilTags(recipes) {
        /* TODO: add commentaire */
        const appareil_tags = document.querySelectorAll("#appareil li")
        let type = "appareil"
        let data = ""
        for (let element in appareil_tags) {
            try {
                appareil_tags[element].addEventListener("click", () => {
                    data = appareil_tags[element].innerText
                    this.addTag(recipes, type, data)
                })
            } catch {
                console.info("code : clickOnAppareilTags()")
            }
        }
    }

    static clickOnUstensilesTags(recipes) {
        /* TODO: add commentaire */
        const ustensiles_tags = document.querySelectorAll("#ustensiles li")
        let type = "ustensiles"
        let data = ""
        for (let element in ustensiles_tags) {
            try {
                ustensiles_tags[element].addEventListener("click", () => {
                    data = ustensiles_tags[element].innerText
                    this.addTag(recipes, type, data)
                })
            } catch {
                console.info("code : clickOnUstensilesTags()")
            }
        }
    }

    static addTag(recipes, type, data) {
        /* TODO: add commentaire */
        const tags_section = document.getElementById("tags_section")
        let custom_color = ""
        if (type == "ingredients") {
            custom_color = "primary"
        }
        else if (type == "appareil") {
            custom_color = "succes"
        }
        else if (type == "ustensiles") {
            custom_color = "danger"
        }
        let tag_html = `
        <button type="button" class="btn btn-${custom_color} custom-bg-${custom_color} tag">
        ${data}
        <span class="badge">
        <svg id="close_tag" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
        </svg>
        </span>
        </button>
        `
        tags_section.insertAdjacentHTML("afterbegin", tag_html)
        this.sortRecipeAfterTag(recipes)
        this.deleteTag()
    }

    static deleteTag() {
        /* TODO: add commentaire */
        const tag = document.querySelectorAll(".tag")
        const close_tag = document.querySelectorAll(".tag #close_tag")
        for (let element in tag) {
            try {
                close_tag[element].addEventListener("click", () => {
                    tag[element].remove()
                })
            }
            catch {
                console.info("code : deleteTag()")
            }
        }
        // TODO: filtrer sans le tag supprimé
    }
}