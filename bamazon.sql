DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NULL,
  price FLOAT(10) NULL,
  stock_quantity INT (10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Paper", "Office", .50, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Computer", "Electronics", 1500, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Car", "Automotive", 50000 , 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pencils", "Office", .50, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shoes", "Fashion", 40, 2000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shirt", "Fashion", 30, 666);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1oz of the dankest girlscout cookies", "Recreation", 420, 6969);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Basket Ball", "Sports", 20, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Speaker", "Electronics", 50, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Michael's 2 Cents", "The Office", .01, 100000);

SELECT * FROM products;