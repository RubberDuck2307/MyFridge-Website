const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

async function setup() {
    let info = await getDetailedRecipe(urlParams.get("id"))
    console.log(info)
    $("#instruction").text(info.instructions)
    let ingredients = info.extendedIngredients



    let foodInFridge = await getFood(Cookies.get("token"))
    foodInFridge = (foodInFridge).data
    console.log(foodInFridge)
    const usedIngredients = []


    const foundIndexes = []

    for (let i = 0; i < foodInFridge.length; i++) {
        for (let j = 0; j < ingredients.length; j++) {
            if (foodInFridge[i].type === ingredients[j].name) {
                usedIngredients.push(foodInFridge[i])
                foodInFridge.splice(i, 1)
                foundIndexes.push(j)
                i -= 1
                break

            }
        }

    }

    buildNeededTable(ingredients, foundIndexes)
    buildUsedTable(usedIngredients)
    buildFridgeTable(foodInFridge)

    return [ingredients, usedIngredients, foodInFridge]
}

function buildNeededTable(ingredients, found) {
    let stringNeededTable =
        "<thead>\n" +
        "    <tr>\n" +
        "      <th >Type</th>\n" +
        "      <th >Amount</th>\n" +
        "      <th >Unit</th>\n" +
        "    </tr>\n" +
        "  </thead>" +
        "<tbody>"

    for (let i = 0; i < ingredients.length; i++) {
        if (found.includes(i)) {
            stringNeededTable += "<tr class='greenBackground'>\n"
        } else {
            stringNeededTable += "<tr class='bg-danger'>\n"
        }
        stringNeededTable +=
            "      <td>" + ingredients[i].name + "</td>\n" +
            "      <td>" + ingredients[i].amount + "</td>\n" +
            "      <td>" + ingredients[i].unit + "</td>\n" +
            "    </tr>"
    }

    stringNeededTable += "</tbody>"

    $("#neededTable").html(stringNeededTable)

    $("#neededTable tbody tr").on("click", function () {
        if ($(this).hasClass("greenBackground")) {
            $(this).removeClass("greenBackground")
            $(this).addClass("bg-danger")
        } else {
            $(this).removeClass("bg-danger")
            $(this).addClass("greenBackground")
        }

    })


}

function buildUsedTable(food) {
    let stringUsedTable =
        "<thead>\n" +
        "    <tr>\n" +
        "      <th >Name</th>\n" +
        "      <th >Type</th>\n" +
        "      <th >Used amount</th>\n" +
        "      <th >Amount in fridge</th>\n" +
        "      <th >Unit</th>\n" +
        "    </tr>\n" +
        "  </thead>" +
        "<tbody>"

    for (let i = 0; i < food.length; i++) {

        if (food[i].usedAmount) {
            stringUsedTable +=
                "     <tr data-id=" + food[i].ID + ">\n" +
                "      <td>" + food[i].name + "</td>\n" +
                "      <td>" + food[i].type + "</td>\n" +
                "      <td>" + food[i].usedAmount + "</td>\n" +
                "      <td>" + food[i].amount + "</td>\n" +
                "      <td>" + food[i].unit + "</td>\n" +
                "    </tr>"

        } else {
            stringUsedTable +=
                "     <tr data-id=" + food[i].ID + ">\n" +
                "      <td>" + food[i].name + "</td>\n" +
                "      <td>" + food[i].type + "</td>\n" +
                "      <td>" + food[i].amount + "</td>\n" +
                "      <td>" + food[i].amount + "</td>\n" +
                "      <td>" + food[i].unit + "</td>\n" +
                "    </tr>"
        }
    }

    stringUsedTable += "</tbody>"
    $("#usedTable").html(stringUsedTable)

    $("#usedTable tbody tr").on("click", function () {
        let trUsed = $("#usedTable").find("tr")
        let trFridge = $("#fridgeTable").find("tr")

        for (let i = 0; i < trUsed.length; i++) {
            $(trUsed[i]).removeClass("greenBackground")

        }
        for (let i = 0; i < trFridge.length; i++) {
            $(trFridge[i]).removeClass("greenBackground")

        }

        changeId = $(this).data().id
        $(this).addClass("greenBackground")
        for (let i = 0; i < food.length; i++) {
            if (changeId === food[i].ID) {
                if (food[i].usedAmount) {
                    $("#amount").val(food[i].usedAmount)
                    break
                } else {
                    $("#amount").val(food[i].amount)
                }
            }

        }
    })


}

function buildFridgeTable(food) {
    let stringFridgeTable =
        "<thead>\n" +
        "    <tr>\n" +
        "      <th >Name</th>\n" +
        "      <th >Type</th>\n" +
        "      <th >Amount</th>\n" +
        "      <th >Unit</th>\n" +
        "    </tr>\n" +
        "  </thead>" +
        "<tbody>"

    for (let i = 0; i < food.length; i++) {
        stringFridgeTable +=
            "     <tr data-id=" + food[i].ID + ">\n" +
            "      <td >" + food[i].name + "</td>\n" +
            "      <td>" + food[i].type + "</td>\n" +
            "      <td>" + food[i].amount + "</td>\n" +
            "      <td>" + food[i].unit + "</td>\n" +
            "    </tr>"
    }

    stringFridgeTable += "</tbody>"
    $("#fridgeTable").html(stringFridgeTable)

    $("#fridgeTable tbody tr").on("click", function () {
        let trUsed = $("#usedTable").find("tr")
        let trFridge = $("#fridgeTable").find("tr")

        for (let i = 0; i < trUsed.length; i++) {
            $(trUsed[i]).removeClass("greenBackground")
        }

        for (let i = 0; i < trFridge.length; i++) {
            $(trFridge[i]).removeClass("greenBackground")
        }


        $("#amount").val("")
        $(this).addClass("greenBackground")
        changeId = $(this).data().id


    })
}

async function makeFavourite(){
    $("#favourite").text("Add to favourite recipes")
    $("#favourite").on("click", async function (){
        let response = await addToFavourite(urlParams.get("id"))
        unmakeFavourite()
    })

}

async function unmakeFavourite(){
    $("#favourite").text("Remove from favourite recipes")
    $("#favourite").on("click", async function (){
        let response = await removeFromFavourite(urlParams.get("id"))

        makeFavourite()
    })

}

async function checkFavourite() {
    let response = await getFavourite()
    let id = urlParams.get("id")
    let favourite = false
    for (let i = 0; i < response.data.length; i++) {
        if (id === response.data[i]["id_recipe"].toString()){
            favourite = true
        }
    }
    if(favourite){
        unmakeFavourite()
    }
    else {
        makeFavourite()
    }
}


let changeId = -1

setup().then((res) => {
    let usedIngredients = res[1]
    let neededIngredients = res[0]
    let foodInFridge = res[2]

    $("#move").on("click", function () {
        let moved = false
        for (let i = 0; i < usedIngredients.length; i++) {
            if (usedIngredients[i].ID === changeId) {
                foodInFridge.push(usedIngredients[i])
                usedIngredients.splice(i, 1)
                moved = true
            }
        }
        if (!moved) {
            for (let i = 0; i < foodInFridge.length; i++) {
                if (foodInFridge[i].ID === changeId) {

                    usedIngredients.push(foodInFridge[i])
                    foodInFridge.splice(i, 1)
                    moved = true
                }
            }
        }

        buildFridgeTable(foodInFridge)
        buildUsedTable(usedIngredients)

    })

    $("#change").on("click", function () {
        $("#errorLabel").text("")
        if (isNaN($("#amount").val())) {
            $("#errorLabel").text("Amount has to be number")
        } else {
            for (let i = 0; i < usedIngredients.length; i++) {
                if (changeId === usedIngredients[i].ID) {
                    if (usedIngredients[i].amount > $("#amount").val()) {
                        usedIngredients[i]["usedAmount"] = $("#amount").val()
                    } else {
                        usedIngredients[i]["usedAmount"] = usedIngredients[i].amount
                    }
                }
            }
        }

        buildUsedTable(usedIngredients)

    })

    $("#cook").on("click", async function () {
        const changedFood = []
        const fullyUsedFood = []

        for (let i = 0; i < usedIngredients.length; i++) {
            if (usedIngredients[i]["usedAmount"]) {
                if (usedIngredients[i].usedAmount === usedIngredients.amount) {
                    fullyUsedFood.push(usedIngredients[i])
                } else {
                    changedFood.push(usedIngredients[i])
                }
            } else {
                fullyUsedFood.push(usedIngredients[i])
            }
        }
        for (let i = 0; i < changedFood.length; i++) {
            changedFood[i].amount = changedFood[i].amount - changedFood[i].usedAmount

        }

        let response = await deleteFood(fullyUsedFood)
        let response2 = await saveFood(changedFood)

        if (response.success && response2.success) {
            open("myFridge.html","_self")

        }

    })

})
checkFavourite()
checkToken()
logout()


