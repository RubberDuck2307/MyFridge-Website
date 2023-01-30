# MyFridge-Website
Web application for tracking food at your home and suggesting recipes based on that. The aplication uses Spoonacular API for getting the recipes and my own REST API for storing information about the food and users into SQL database

Created with html, javascript, jquery, bootstrap5 and js-cookie

REST_API - https://github.com/RubberDuck2307/MyFridge-REST_API
spoonacular API - https://spoonacular.com/food-api

To make the web site work it is necessary to create an account on spoonacular.com and get a user key. The key has to be hardcoded as a constant called spoonacularApiKey in utilities.js . Without that all the HTTP requests on spoonacular API do not work
