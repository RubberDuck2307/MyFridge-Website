// $("#submit").on("click",function (){
//  login($("#username").val(), $("#password").val())
// })
//
// $("#get").on("click",  function (){
//  let id = parseJwt(Cookies.get("token")).id[0][0].id
//  getFood(id)
// })
//
// async function getFood(id){
//  let response = await fetch("http://localhost:3000/food/" + id, {
//   method: 'GET', // *GET, POST, PUT, DELETE, etc.
//   headers: {
//    'Content-Type': 'application/json'
// ,
//   "authorization": Cookies.get("token")}
//  })
//  response = await response.json()
//  console.log("hello")
//  console.log(response)
// }
// async function login(username, password){
//  let response = await fetch("http://localhost:3000/users/login", {
//   method: 'POST', // *GET, POST, PUT, DELETE, etc.
//   mode: 'cors', // no-cors, *cors, same-origin
//   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//   credentials: 'same-origin', // include, *same-origin, omit
//   headers: {
//    'Content-Type': 'application/json'
//    // 'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   redirect: 'follow', // manual, *follow, error
//   referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//   body: JSON.stringify({username: username, password:"password"}) // body data type must match "Content-Type" header
//  });
//  response = await response.json()
//  Cookies.set("token", response.token, {expires:1})
//  return response; // parses JSON response into native JavaScript objects
// }
//
// function parseJwt (token) {
//  let base64Url = token.split('.')[1];
//  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//  let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
//   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//  }).join(''));
//
//  return JSON.parse(jsonPayload);
// }
//
