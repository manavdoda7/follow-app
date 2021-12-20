const express = require('express')
const app = express()
require('dotenv').config()
// Database Intergration
require('./middlewares/dbconnection')


app.get('/', (req, res)=>{
    res.end('Hi');
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server started at port ${process.env.PORT}`);
})