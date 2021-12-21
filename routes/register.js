const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/', (req, res)=> {
    console.log('GET /register request');
    if(req.session.user!==undefined) {
        req.flash('You are already logged in. Logout first.')
        res.redirect('/home')
        return
    }
    res.render('register', {message:req.flash('message')})
})

router.post('/', async(req, res)=>{
    console.log('POST /register request');
    const {username, email, fName, lName, password, cpassword} = req.body
    // Checking if passwords are same?
    if(password!==cpassword) {
        req.flash('message', "Passwords don't match")
        res.redirect('/register')
        return
    }
    // Checking if user is trying to make multiple accounts with same email ID
    try{
        let user = await User.emailExists(email)
        user = user[0]
        if(user.length!=0) {
            req.flash('message', 'Email already exists. Please login.')
            res.redirect('/login')
            return
        }
    } catch(err) {
        console.log('Fetching email exists error.', err);
        req.flash('message', 'Please try again after sometime')
        res.redirect('/register')
        return
    }
    // Checking if username is already taken
    try{
        let user = await User.usernameExists(username)
        user = user[0]
        if(user.length!=0) {
            req.flash('message', 'Username already exists. Please try again with a diffrent username.')
            res.redirect('/register')
            return
        }
    } catch(err) {
        console.log('Fetching username exists error.', err);
        req.flash('message', 'Please try again after sometime')
        res.redirect('/register')
        return
    }

    // Hashing of Password
    let hashedPassword
    try{
        hashedPassword = await bcrypt.hash(password, 10)
    } catch(err) {
        console.log('Bcrypt error', err);
        req.flash('message', 'Please try again after sometime')
        res.redirect('/register')
        return
    }

    // Saving new user to Database
    try{
        let user = new User(username, email, fName, lName, hashedPassword)
        User.createUser(user)
    } catch(err) {
        console.log('Error in saving student to DB.', err);
        req.flash('message', 'Please try again after sometime')
        res.redirect('/register')
        return
    }
    console.log('User registered');
    req.flash('message', 'User registered. Please login.')
    res.redirect('/login')
})

module.exports=router