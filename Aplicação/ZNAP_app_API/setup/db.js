import mysql from "mysql"

export const db = mysql.createConnection({
    host:"localhost",
    user: "admin",
    password: "Localznap@dmin**",
    database: "znapchallenge_db"
})