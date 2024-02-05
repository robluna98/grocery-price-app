-- Grab Basic Data 
SELECT product_unique_id, product_name, product_price, product_store_name FROM products 

-- Check for Duplicate values
SELECT product_name, product_store_name, COUNT(*) 
FROM products 
GROUP BY product_name, product_store_name 
HAVING COUNT(*) > 1

-- Grab specific string data
SELECT product_name, product_units, product_price
FROM products
WHERE product_name LIKE '%Watermelon%'

-- Grab all data
SELECT * FROM products
ORDER BY timestamp ASC

-- Grab size of table
SELECT pg_size_pretty(pg_relation_size('products'));

-- Delete all data from table
DELETE FROM products;
