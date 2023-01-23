async function cookFromFridge() {
    let response = await getFood()
    const food = []
    for (let i = 0; i < response.data.length; i++) {
        food.push(response.data[i])
    }

    let recipes = await getRecipes(food)
    return recipes
}

async function cookFavourite(){
    let favourite_recipes = await getFavourite()
    favourite_recipes = favourite_recipes.data
    const idArray = []
    for (let i = 0; i < favourite_recipes.length; i++) {
        idArray.push(favourite_recipes[i]["id_recipe"])
    }
    let response = await getInformationBulk(idArray)
    return response
}

async function setup() {

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const type = urlParams.get("type")

    let recipes

    if(type === "fridge"){
        recipes = await cookFromFridge()
    }

    else if (type ==="favourite"){
        recipes = await cookFavourite()
    }

    let string = ""
    for (let i = 0; i < recipes.length; i++) {
        string += "<div class=\"col-lg-4 col-md-6 d-flex justify-content-center pb-5\">" +
            "<div class=\"card w-75\">\n" +
            "           <img src=\""+ recipes[i].image + "\" class=\"card-img-top\" alt=\"...\">\n" +
            "           <div class=\"card-body\">\n" +
            "               <h5 class=\"card-title\">"+ recipes[i].title +"</h5>\n" +
            "           </div>" +
            "           <div class='card-footer'> " +
            "               <button data-id=" + recipes[i].id + " class=\"btn btn-primary\">Cook</button>\n" +
            "       </div>" +
            "</div>" +
            "</div>"
    }
    $("#main").html(string)

    $("button").on("click",function (){
        open(`recipe.html?id=${$(this).data().id}`,"_self")
    })


}
checkToken()

setup()
logout()