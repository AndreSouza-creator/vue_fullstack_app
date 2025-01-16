import express from 'express'
import userRoutes from "./app/routes/usersroutes.js"
import productRoutes from "./app/routes/productroutes.js"
import pedidosRoutes from "./app/routes/pedidosroutes.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/", userRoutes)
app.use("/produtos/", productRoutes)
app.use("/pedidos/", pedidosRoutes)

app.listen(8800)