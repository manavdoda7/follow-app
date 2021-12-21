const express = require('express')

const router = express.Router()

router.get('/', (req, res)=>{
    console.log('GET / request');
    if(req.session.user!=undefined) res.redirect('/home')
    res.render('index', {message:req.flash('message')})
})

module.exports = router