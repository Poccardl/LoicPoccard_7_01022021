function fetchData() {
    /* TODO: add commentaire */
    fetch("data/recipes.json")
    .then(function(resp) {
        return resp.json()
    })
    .then(function(data) {
        console.log("data :", data["recipes"])
    })
}

fetchData()