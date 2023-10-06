import json
from connection_db import connect_to_mysql
from dotenv import load_dotenv
import os

load_dotenv()

config = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv("DB_PASSWORD"),
    "database": "groceries",
}

cnx = connect_to_mysql(config, attempts=3)
if cnx and cnx.is_connected():
    with cnx.cursor() as cursor:
        # Drop the exisitng 'heb' and 'costco' table if it exists
        drop_table_query = "DROP TABLE IF EXISTS heb, costco"
        cursor.execute(drop_table_query)

        # Create the 'heb' table
        create_heb_table_query = """
        CREATE TABLE heb (
            category VARCHAR(255),
            item VARCHAR(255),
            price VARCHAR(255),
            image VARCHAR(255),
            unit VARCHAR(255)
        )"""
        cursor.execute(create_heb_table_query)

        # Create the 'costco' table
        create_costco_table_query = """
        CREATE TABLE costco (
            category VARCHAR(255),
            item VARCHAR(255),
            price VARCHAR(255),
            image VARCHAR(255),
            unit VARCHAR(255)
        )"""
        cursor.execute(create_costco_table_query)

        # Read the JSON data from a file
        with open("data/storeData.json") as file:
            data = json.load(file)

        # Parse the JSON data and insert into 'heb' and 'costco' table
        for store_name, store_data in data.items():
            table_name = store_name.lower()
            for item in store_data:
                insert_query = f"INSERT INTO {table_name} (category, item, price, image, unit) VALUES (%s, %s, %s, %s, %s)"
                values = (item["category"], item["item"], item["price"],
                          item["image"], item.get("unit", None))
                cursor.execute(insert_query, values)

        cnx.commit()

        # Retrive and print the data from the 'heb table
        select_heb_query = "SELECT * FROM heb LIMIT 5"
        cursor.execute(select_heb_query)
        rows = cursor.fetchall()
        print("Heb Data:")
        for row in rows:
            print(row)

        # Retrieve and print the data from the 'costco' table
        select_costco_query = "SELECT * FROM costco LIMIT 5"
        cursor.execute(select_costco_query)
        rows = cursor.fetchall()
        print("Costco Data:")
        for row in rows:
            print(row)

    cnx.close()
else:
    print("Connection failed.")
