import express from 'express'
import router from './routes/index.js'
import './models/conn.js'
const app = express()
const PORT = process.env.PORT || 3000


app.use(express.urlencoded({extended:false}))
app.use('/', router)



app.listen(PORT)