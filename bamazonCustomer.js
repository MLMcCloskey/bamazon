var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mlm123",
    database: "bamazon_db"
});

connection.connect(function (error) {
    if (error) throw error;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        inquirer
            .prompt([
                {
                    name: "productList",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What would you like to buy?"
                },
                {
                    name: "purchaseQuantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.productList) {
                        chosenItem = results[i];
                        // console.log(chosenItem);
                    }
                }
                if (parseInt(chosenItem.stock_quantity) < parseInt(answer.purchaseQuantity)) {
                    console.log(`Sorry. We don't have that many in stock. We currently have ${chosenItem.stock_quantity} available.`)
                    start();
                } else {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{ stock_quantity: chosenItem.stock_quantity - answer.purchaseQuantity },
                        { id: chosenItem.id }],
                        function (error) {
                            if (error) throw error;
                        }
                    )
                    console.log(`That will be $${chosenItem.price * answer.purchaseQuantity}`);
                    console.log('Thank you for shopping with us!');
                    connection.end();
                }
            })
    })
}