/*control db to create new Meal and respond query with all meals
handle data between database and user model*/

//require dependencies
var Meal = require('./mealModel.js');
Q = require('q');

//make findMeal, createMeal and findMeal promise functions
var findMeal = Q.nbind(Meal.findOne, Meal);
var createMeal = Q.nbind(Meal.create, Meal);
var findAllMeals = Q.nbind(Meal.find, Meal);

//export module allMeals and newMeal
module.exports = {
  getOneMeal: function (req, res) {
    console.log(req);
    Meal.findOne({ _id: req.params.id}, function(err, meal) {
      if (err) {
        console.log(err);
      } else {
        res.send(meal);
      }
    });
  },
  //returns all meals the database as the response.
  allMeals: function (req, res, next) {
    findAllMeals({})
      .then(function (meals) {
        res.json(meals);
      })
      .fail(function (error) {
        next(error);
      });
  },



  //creates a meal that gets saved to the database.
  newMeal: function (req, res, next) {
    //variable meal takes the request body and transforms it into an object
    var meal = {
      title : req.body.title,
      picture : req.body.picture,
      description : req.body.description,
      date : req.body.date,
      time : req.body.time,
      user : req.body.user
    };
    //create meal is wrapped in a function to handle asynchronous nature of createMeal
    var makeMeal = function (meal) {
      return createMeal(meal);
    };
    //makeMeal is invoked which saves a meal to the database
    makeMeal(meal)
    .then(function(createdMeal){
      //upon successful save to the database the server responds with data saved to the database in JSON form
      if (createdMeal){
        res.json(createdMeal);
      }
    })
    .fail(function(error){
      next(error);
    });
  },

  //delete a meal by id
  deleteMeal: function (req, res) {
    var id = req.body.id;
    Meal.remove({ _id: req.body.id }, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send('deleted');
      }
    });
  },

  updateMeal: function(req, res, next){
    //client updates the meal information by supplying the id as well as the updated information
    Meal.findOne({_id:req.body.id}, function (err, meal) {
      if(err){
        res.send(err);
      }
      //every property the client supplies gets updated
      for(var key in req.body) {
        if(req.body.hasOwnProperty(key)){
          meal[key]=req.body[key];
        }
      }
      //the updated meal is saved to the database
      meal.save(function(err){
        res.json(meal);
      });
    });
  }
};

