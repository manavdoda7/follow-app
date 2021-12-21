const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    console.log('GET / request');
    res.render('index', {message:req.flash('message')})
})

module.exports = router