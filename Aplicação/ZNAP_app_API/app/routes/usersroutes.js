import express from 'express'
import { getUsers } from "./../controller/userscontroller.js"
import { addUser } from "./../controller/userscontroller.js"
import { updateUser } from "./../controller/userscontroller.js"
import { deleteUser } from "./../controller/userscontroller.js"

const userRoutes = express.Router()
userRoutes.get("/", getUsers)
userRoutes.post("/addcustomer", addUser)
userRoutes.put("/editcustomer/:id", updateUser)
userRoutes.delete('/deletecustomer/:id', deleteUser);

export default userRoutes