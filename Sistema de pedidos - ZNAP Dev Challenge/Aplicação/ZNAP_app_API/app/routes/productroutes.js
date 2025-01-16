import express from 'express'
import { getProdutos } from "../controller/productscontroller.js"
import { addProduct } from "../controller/productscontroller.js"
import { updateProduct } from "../controller/productscontroller.js"
import { deleteProduct } from "../controller/productscontroller.js"

const productRoutes = express.Router()
productRoutes.get("/getprodutos", getProdutos)
productRoutes.post("/addproduct", addProduct)
productRoutes.post("/editproduct", updateProduct)
productRoutes.post("/deleteproduct", deleteProduct)

export default productRoutes