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
connection.connect(function (err) {
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
            choices: ["BUY", "VIEW (coming soon)"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.postOrBid.toUpperCase() === "BUY") {
                buyProduct();
            }
            else {
                viewTransactions();
            }
        });
}

function isValidOrder(idVal, quantity, productsArr) {
    var idArr = [1];
    for (var i = 0; i < productsArr.length; i++) {
        idArr.push(parseInt(productsArr[i].item_id));
    }

    var isIdValid = false;
    var isQuantityValid = false;

    //if the id exists this is true
    isIdValid = idArr.indexOf(parseInt(idVal, 10)) > -1;

    if (!isIdValid) {
        console.log("Bad ID");
        return false;
    } else {
        console.log("ID is valid")
        isQuantityValid = (productsArr[(idVal - 1)].stock_quantity >= quantity);
        if (isQuantityValid) {
            console.log("Quantity is valid");
            return true;
        } else {
            console.log("Quantity NOT VALID");
            return false;
        }
    }
}

function updateBamazon(idNumber, OrderQuantity, results) {
    var quantityVal = results[(idNumber - 1)].stock_quantity;
    var updatedQuantity = quantityVal - OrderQuantity;
    var updateQuery = "UPDATE products SET stock_quantity = '"+updatedQuantity+"' WHERE item_id = '"+idNumber+"';";
    connection.query(updateQuery, function (err) {
            if (err) {console.log(err);} throw err;
        }
    );
    console.log(results[idNumber-1].product_name + " quantity changed from "+quantityVal+" to "+updatedQuantity);
}

function displayTotal(idNumber, OrderQuantity, results)
{
    var price = results[(idNumber - 1)].price;
    var item = results[(idNumber - 1)].product_name;
    var total = price * OrderQuantity;
    console.log("ORDER TOTAL : $"+total+" for "+OrderQuantity+" "+item+"(s)");
    start();
}

function buyProduct() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            product = results[i];
            console.log("ProductID: " + product.item_id + " | Product: " + product.product_name + " | Deprtmnt: " + product.department_name + " | Price: $" + product.price + " | Stock: " + product.stock_quantity);
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
            .then(function (answer) {
                var isGoodOrder = false;

                isGoodOrder = isValidOrder(answer.idNumber, answer.quantity, results);
                if (isGoodOrder) {
                    updateBamazon(answer.idNumber, answer.quantity, results);
                    displayTotal(answer.idNumber, answer.quantity, results);
                } else {
                    console.log("BAD INPUT RESTARTING TRANSACTION");
                    start();
                }
            });
    });
}