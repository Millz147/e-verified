import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.DB)

mongoose.connection
.on('error',(err)=>{
    console.log('DB connection failed')
})
.once('open', ()=>{
    console.log('DB Connected')
})