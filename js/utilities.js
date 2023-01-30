function checkToken() {
    if (!Cookies.get("token")) {
        open("login.html", "_self")
    }
}

async function signUp(username, password, email, firstName, lastName) {
    let response = await fetch("http://localhost:3000/users/", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        }) // body data type must match "Content-Type" header
    });
    response = await response.json()

    return response; // parses JSON response into native JavaScript objects
}

async function login(username, password) {
    let response = await fetch("http://localhost:3000/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });
    response = await response.json()
    return response
}


function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getFood() {
    let token = Cookies.get("token")
    let id = parseJwt(token).id
    let response = await fetch(`http://localhost:3000/food/${id}`, {
        method: "GET",
        headers: {"authorization": token}
    })
    response = await response.json()
    return response
}

async function getAllFood() {
    if (Cookies.get("token")) {
        let token = Cookies.get("token")
        let response = await getFood(token)
        let data = response.data
        for (let i = 0; i < data.length; i++) {
            sessionStorage.setItem(i.toString(), JSON.stringify(response.data[i]))
        }


    } else (window.open("login.html", "_self"))
}

function resetSessionStorage() {
    let keys = Object.keys(sessionStorage)
    for (let i = 0; i < keys.length; i++) {
        sessionStorage.removeItem(keys[i])
    }
}

async function getRecipes(food) {
    let string = ""
    for (let i = 0; i < food.length; i++) {
        if (i !== food.length - 1) {
            string += food[i].type + "%2C"
        } else string += food[i].type + "&"
    }

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spoonacularApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    let response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${string}number=9&ignorePantry=true&ranking=1`, options)
    response = await response.json()
    return response
}


async function getDetailedRecipe(id) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spoonacularApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    let response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`, options)
    response = await response.json()
    return response
}

async function deleteFood(food) {
    console.log(food)
    let userID = parseJwt(Cookies.get("token"))
    let response = await fetch(`http://localhost:3000/food/${userID.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "authorization": Cookies.get("token")
        },
        body: JSON.stringify({food: food})
    })
    response = await response.json()
    return response
}

async function saveFood(food) {
    let userID = parseJwt(Cookies.get("token"))
    let response = await fetch(`http://localhost:3000/food/${userID.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            "authorization": Cookies.get("token")
        },
        body: JSON.stringify({food: food}
        )
    })
    response = await response.json()
    return response
}

function logout() {
    $("#logout").on("click", function () {
        Cookies.remove("token")
        open("index.html", "_self")
    })
}

async function addToFavourite(id) {
    let userID = parseJwt(Cookies.get("token"))
    let response = await fetch(`http://localhost:3000/food/favourite/${userID.id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "authorization": Cookies.get("token")
        },
        body: JSON.stringify({id: id}
        )
    })
    return await response.json()
}

async function getFavourite() {
    let userID = parseJwt(Cookies.get("token"))
    let response = await fetch(`http://localhost:3000/food/favourite/${userID.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "authorization": Cookies.get("token")
        }
    })

    return await response.json()

}

async function getInformationBulk(idArray){
    let ids = ""


    for (let i = 0; i < idArray.length; i++) {
        ids += idArray[i]
        if (i !== idArray.length -1){
            ids += "%2C"
        }
    }

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spoonacularApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    let response = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk?ids=${ids}`, options)
    response = await response.json()
    return response
}

async function removeFromFavourite (id){
    let userID = parseJwt(Cookies.get("token"))
    let response = await fetch(`http://localhost:3000/food/favourite/${userID.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            "authorization": Cookies.get("token")
        },
        body: JSON.stringify({id: id})
    })

    response = response.json()
    return response
}