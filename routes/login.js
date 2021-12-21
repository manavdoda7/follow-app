const express = require('express');
const { usernameExists} = require('../models/user');
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/', (req, res)=>{
    console.log('GET /login request');
    if(req.session.user!==undefined) {
        req.flash('message', 'You are already logged in.')
        res.redirect('/home')
    }
    res.render('login', {message: req.flash('message')})
})

router.post('/', async(req, res)=>{
    const {username, password} = req.body
    let User 
    try{
        User = await usernameExists(username)
    } catch(err){
        console.log('User fetch error');
        req.flash('message', "Please try again after sometime")
        res.redirect('/login')
        return
    }
    User = User[0]
    if(User.length==0) {
        req.flash("Username doesn't exist.")
        req.redirect('/login')
        return
    }
    User=User[0]
    console.log(User);
    bcrypt.compare(password, User.password, (bcryptErr, result)=>{
        if(bcryptErr) {
            console.log('Bcrypt Error', bcryptErr);
            req.flash('message', 'Please try again after sometime.')
            res.redirect('/login')
            return
        }
        if(result){
            console.log('Login successfull');
            req.session.user = User
            req.flash('message', 'Successfully logged in')
            res.redirect('/home')
        } else {
            console.log('Password mismatch');
            req.flash('message', 'Your password is incorrect.')
            res.redirect('/login')
        }
    })
})

module.exports = router