function fillTable() {


    let keys = Object.keys(sessionStorage)
    let string = " <thead>\n" +
        "    <tr>\n" +
        "      <th>Name</th>\n" +
        "      <th>Type</th>\n" +
        "      <th>Amount</th>\n" +
        "      <th>Unit</th>" +
        "    </tr>\n" +
        "  </thead>\n" +
        "  <tbody>"

    for (let i = 0; i < keys.length; i++) {
        let object = JSON.parse(sessionStorage.getItem(keys[i]))
        string += "<tr data-index = " + keys[i] + ">\n" +
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
        let food = JSON.parse(sessionStorage.getItem(changeIndex))
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
        let index = Object.keys(sessionStorage).length
        sessionStorage.setItem((index).toString(), JSON.stringify(food))
        await save()
        resetTable()
        fillTable()
    }
}

function resetTable() {
    $("#table").html("")
}

async function save() {
    let keys = Object.keys(sessionStorage)
    const foodArray = []
    for (let i = 0; i < keys.length; i++) {
        foodArray.push(sessionStorage[i])
    }
    let response = saveFood(foodArray)
    if (!response.success) {
        $("#errorText").text("Something went wrong")
    } else {
        resetSessionStorage()
        await getAllFood()
    }
}

async function setup() {
    resetSessionStorage()
    await getAllFood()
    fillTable()

}

let changeIndex = -1


$("#change").on("click", async function () {
    if (changeIndex !== -1) {
        $("#errorText").text("")
        let currentFood = JSON.parse(sessionStorage.getItem(changeIndex.toString()))
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
            sessionStorage.setItem(changeIndex, JSON.stringify(food))
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
        if (changeIndex !== -1) {
            let response = await deleteFood([sessionStorage.getItem(changeIndex)])
            if (response.success){
                resetSessionStorage()
                await getAllFood()
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

checkToken()
setup()
logout()

