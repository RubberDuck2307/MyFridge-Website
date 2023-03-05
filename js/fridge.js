function fillTable() {


    let string = " <thead>\n" +
        "    <tr>\n" +
        "      <th>Name</th>\n" +
        "      <th>Type</th>\n" +
        "      <th>Amount</th>\n" +
        "      <th>Unit</th>" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>"

    for (let i = 0; i < data.length; i++) {
        let object = data[i]
        string += "<tr data-index = " + i + ">\n" +
            "<td>" + object.name + "</td>\n" +
            "<td>" + object.type + "</td>\n" +
            "<td>" + object.amount + "</td>\n" +
            "<td>" + object.unit + "</td>\n" +
            "</tr>\n"
    }

    string += "</tbody>"
    $("#table").html(string)
    $("tr").on("click", function () {
        let tr = $("#table").find("tr")
        $(tr).each(function () {
            $(this).removeClass("greenBackground")
        })
        changeIndex = $(this).data().index
        $(this).addClass("greenBackground")
        let food = data[changeIndex]
        $("#amount").val(food.amount)
        $("#type").val(food.type)
        $("#unit").val(food.unit)
        $("#name").val(food.name)
    })
}


async function addToTable() {
    $("#errorText").text("")
    let name = $("#name").val()
    let type = $("#type").val()
    let amount = $("#amount").val()
    let unit = $("#unit").val()

    name.replace(/\s/g, '')
    type.replace(/\s/g, '')

    if (type === "" || name === "") {
        $("#errorText").text("Name and type must be filled in")
    } else {
        let food = {name: name, type: type, amount: amount, unit: unit}
        data[data.length] = food
        await save()
        let response = await getFood();
        data =  response.data
        resetTable()
        fillTable()
    }
}

function resetTable() {
    $("#table").html("")
}

async function save() {
    const foodArray = []
    for (let i = 0; i < data.length; i++) {
        foodArray.push(data[i])
    }
    let response = await saveFood(foodArray)
    if (!response.success) {
        $("#errorText").text("Something went wrong")
    }
}

async function setup() {
    let response = await getFood();
    data =  response.data
    fillTable()

}

let changeIndex = -1


$("#change").on("click", async function () {
    if (changeIndex !== -1) {
        $("#errorText").text("")
        let currentFood = data[changeIndex]
        let id = currentFood.ID
        let userid = currentFood.userID
        let name = $("#name").val()
        let type = $("#type").val()
        let amount = $("#amount").val()
        let unit = $("#unit").val()

        name.replace(/\s/g, '')
        type.replace(/\s/g, '')

        if (type === "" || name === "") {
            $("#errorText").text("Name and type must be filled in")
        } else {
            let food = {ID: id, userID: userid, name: name, type: type, amount: amount, unit: unit}
            data[changeIndex] = food
            await save()
            resetTable()
            fillTable()
        }
    }
})

$("#add").on("click", function () {
    addToTable()
})

$("#delete").on("click", async function () {
    const foodToDelete = [];
        if (changeIndex !== -1) {
            foodToDelete.push(data[changeIndex])
            let response = await deleteFood(foodToDelete)
            if (response.success){
                let response = await getFood();
                data =  response.data
                resetTable()
                fillTable()
            }
            else {
                $("#errorText").text("Something went wrong")
            }
        }
    }
)


$("#reset").on("click", function () {
    let tr = $("#table").find("tr")
    $(tr).each(function () {
        $(this).removeClass("greenBackground")
    })
    changeIndex = -1
    $("#amount").val("")
    $("#type").val("")
    $("#unit").val("")
    $("#name").val("")

})
let data
checkToken()
setup()
logout()

