import json
from myconnection import connect_to_mysql
from dotenv import load_dotenv
import os

load_dotenv()

config = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv("DB_PASSWORD"),
    "database": "sakila",
}

cnx = connect_to_mysql(config, attempts=3)
if cnx and cnx.is_connected():
    with cnx.cursor() as cursor:
        result = cursor.execute("SELECT * FROM actor LIMIT 5")
        rows = cursor.fetchall()
        for rows in rows:
            print(rows)
    cnx.close()
else:
    print("Connection failed.")