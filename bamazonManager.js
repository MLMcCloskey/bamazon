var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mlm123",
    database: "bamazon_db"
});

// function Product(product_name, department_name, price, stock_quantity)

connection.connect(function(error){
    if (error) throw error;
    manager();
});

function manager(){
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;

        inquirer
            .prompt(
                {
                    name: "manage",
                    type: "rawlist",
                    message: "Choose an action to perform:",
                    choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
                }
            )
            .then(function(answer){
                switch (answer.manage){
                    case "View Products For Sale":
                        productList();
                        break;

                    case "View Low Inventory":
                        lowInventory();
                        break;

                    case "Add to Inventory":
                        addInventory();
                        break;

                    case "Add New Product":
                        addProduct();
                        break;
                }
            });       
    })
}


function productList(){
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;
        console.log(results)
    })
    connection.end();
}


function lowInventory(){
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;

        for (i = 0; i<results.length; i++){
            if (results[i].stock_quantity < 5){
                console.log(results[i])
            }
        }
    })
    connection.end();
}



function addInventory(){
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;

        inquirer
            .prompt([
                {
                name: "productList",
                type: "rawlist",
                choices: function(){
                    var choiceArray = [];
                    for (i = 0; i < results.length; i++){
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "What would you like to restock?"
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "How many should we order?"
            }
            ])
            .then(function(answer){
                var chosenItem;
                for (i =0; i < results.length; i++) {
                    if (results[i].product_name === answer.productList) {
                        chosenItem = results[i];
                        // console.log(chosenItem);
                    }
                }
                connection.query("UPDATE products SET ? WHERE ?", 
                [
                    {stock_quantity: parseInt(chosenItem.stock_quantity) + parseInt(answer.stockQuantity)},
                    {id : chosenItem.id}
                ],
                function(error, results){
                    if (error) throw error;
                    console.log("Order placed!");
                    console.log(chosenItem.stock_quantity);
                    connection.end()
                })
            }
            )
        })
}



function addProduct(){
    connection.query("SELECT * FROM products", function(error, results){
        if (error) throw error;

        inquirer
            .prompt([
                {
                    name: "product",
                    message: "What would you like to add?",
                    type: "input"
                }, {
                    name: "department",
                    message: "What department does this belong in?",
                    type: "input"
                }, {
                    name: "cost",
                    message: "How much should we charge for it?",
                    type: "input"
                }, {
                    name: "quantity",
                    message: "How many should we order?",
                    type: "input"
                }])
            .then(function(answer){
                // new Product (
                //     product_name= answer.name,
                //     department_name= answer.department,
                //     price = answer.cost,
                //     stock_quantity = answer.quantity
                // )
                connection.query("INSERT INTO products SET ?", {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.cost,
                    stock_quantity: answer.quantity
                }, 
            function (error){
                if (error) throw error;
                console.log("New product succesfully added!")
                connection.end();
            });
            })
        })
}