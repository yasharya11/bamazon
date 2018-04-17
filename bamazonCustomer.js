/** bamazon pseudo code
 *  
 * getProductsArray(){
 *  goes into the database and grabs an array of all the objects and returns it
 * }
 * 
 * buyProduct(){
 *  productsArryay[] = getProductsArray();
 *  create a nice table to diplay all the products and print it int he CLI
 * }
 * 
 * getQuantityOfDifferentProducts(){
 *   look into the database and see how many different products are in it, then return it
 * }
 * 
 * verifyOrderValidity(input){
 *  get user input
 *  if input is valid accoring to getQuantityOfDifferentProducts() then return true else false
 * }
 * 
 * createOrder(){
 *  if (verifyOrderValidity(input))
 *  
 * }
 * 
 * runBamazon(){
 *  CONNECT TO DATABASE
 *  buyProduct()
 *  createOrder()
 * }
 * 
 * 
 * if exit = false {
 * runBamazon()
 * }
 */


var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [BUY] a product or [VIEW] your transactions?",
      choices: ["BUY", "VIEW"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid.toUpperCase() === "BUY") {
        buyProduct();
      }
      else {
        viewTransactions();
      }
    });
}

function isValidOrder(id, quantity, productsArr) {
    console.log("checking validity of order");
    var idArr = [];
    for(var i = 0; i < productsArr.length ; i++)
    {
        idArr.push(productsArr[i].item_id);
    }

    var isIdValid = false;
    var isQuantityValid = false;
    
    //if the id exists this is true
    isIdValid = (idArr.indexOf(id) != -1);

    if (isIdValid)
    {   
        console.log("Bad ID");
        return false;
    } else {
        console.log("ID is valid")
        isQuantityValid = (productsArr[(id - 1)].stock_quantity >= quantity);
        if (isQuantityValid)
        {
            console.log("Quantity is valid");
            return true;
        } else {
            console.log("Quantity NOT VALID");
            return false;
        }
    }
}

function buyProduct() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for(var i = 0 ; i<results.length ; i++)
    {
        console.log(results[i]);
    }
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "idNumber",
          type: "input",
          message: "What is the ID of the Product you wish to Purchase?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ])
      .then(function(answer) {
        console.log(answer.idNumber);
        console.log(answer.quantity);
        var isGoodOrder = true;
        isGoodOrder = isValidOrder(answer.idNumber, answer.quantity, results);
        if(isGoodOrder)
        {
            console.log("UPDATE THE DATABASE");
            console.log("DISPLAY THE TOTAL");
            start();
        } else {
            console.log("that input was shit homeboi");
            start();
        }
      });
  });
}



// // function to handle posting new items up for auction
// function buyProduct() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid,
//           highest_bid: answer.startingBid
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }