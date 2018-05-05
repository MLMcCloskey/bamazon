DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(50, 2),
    stock_quantity INT(50),
    
    PRIMARY KEY (id)
)

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("socks", "clothing", 499.99, 3);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Carrots", "food", 30.00, 7),
		("Gorilla Glue", "household", 90.00, 6),
        ("Blueberry", "food", 90.00, 5),
        ("White Shirt", "clothing", 8.99, 15);
        

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Underwear", "clothing", 4.99, 0),
		("Magnifying Glass", "household", 8.49, 3),
        ("Battery", "household", 12.99, 3),
        ("Apple", "food", 1999.99, 9),
        ("Yeezy Boost 750", "clothing", 1399.00, 5);