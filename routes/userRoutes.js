const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.get('/logout', (req, res)=>{
    console.log('GET /user/logout request');
    req.session.destroy(function(err){
        if(err) {
            console.log('Logout error');
            res.redirect('/home')
            return
        } else {
            console.log('Logged out successfully.');
            res.redirect('/')
        }
    })
})

router.get('/removefollower/:username', async (req, res)=>{
    const followedBy = req.params.username
    console.log(`GET /user/removefollower/${followedBy} request`);
    if(req.session.user===undefined) {
        req.flash('message', 'Please login first.')
        res.redirect('/login')
        return
    }
    const followed=req.session.user.username
    try{
        let check = await User.checkDuplicate(followed, followedBy)
        check = check[0]
        if(check.length==0) {
            req.flash('message', 'This user is not following you.')
            res.redirect('/home')
            return
        }
    } catch(err) {
        console.log('Error while checking validity of relationship.', err);
        req.flash('message', 'Please try again after sometime.')
        res.redirect('/home')
        return
    }
    try{
        await User.removeRelation(followed,followedBy)
    } catch(err) {
        console.log('Error in removing relationship');
        req.flash('message', 'Please try again after sometime.', err)
        res.redirect('/home')
        return
    }
    req.flash('message' ,'Follower removed.')
    res.redirect('/home')
})

router.get('/removefollowing/:username', async(req, res)=>{
    const followed = req.params.username
    console.log(`GET /user/removefollowing/${followed} request`);
    if(req.session.user===undefined) {
        req.flash('message', 'Please login first.')
        res.redirect('/login')
        return
    }
    const followedBy=req.session.user.username
    try{
        let check = await User.checkDuplicate(followed, followedBy)
        check = check[0]
        if(check.length==0) {
            req.flash('message', 'You are not following this user')
            res.redirect('/home')
            return
        }
    } catch(err) {
        console.log('Error while checking validity of relationship.', err);
        req.flash('message', 'Please try again after sometime.')
        res.redirect('/home')
        return
    }
    try{
        await User.removeRelation(followed,followedBy)
    } catch(err) {
        console.log('Error in removing relationship');
        req.flash('message', 'Please try again after sometime.', err)
        res.redirect('/home')
        return
    }
    req.flash('message' ,'Following removed.')
    res.redirect('/home')
})

router.post('/follow', async(req, res)=>{
    console.log('POST /user/follow request');
    if(req.session.user===undefined) {
        req.flash('message', 'Please login first')
        res.redirect('/login')
        return
    }
    const followedBy = req.session.user.username
    const followed = req.body.username
    if(followedBy===followed) {
        req.flash('message', 'Please enter the username of person you want to follow.')
        res.redirect('/home')
        return
    }
    let user
    try{
        user = await User.usernameExists(followed)
    } catch(err) {
        console.log('Error in fetching user from db');
        req.flash('message', 'Please try again after sometime.')
        res.redirect('/home')
        return
    }
    user = user[0]
    if(user.length==0) {
        req.flash('message', `User doesn't exist`)
        res.redirect('/home')
        return
    }
    try{
        let check = await User.checkDuplicate(followed, followedBy)
        check = check[0]
        if(check.length) {
            req.flash('message', `You've already followed this user.`)
            res.redirect('/home')
            return
        } 
    } catch(err) {
        console.log('Error in fetching duplicates.', err);
        req.flash('message', 'Please try again after sometime.')
        res.redirect('/home')
        return
    }
    try{
        await User.follow(followed, followedBy)
    } catch(err) {
        console.log('Error in saving relation to DB', err);
        req.flash('message', 'Please try again after sometime.')
        res.redirect('/home')
        return
    }
    req.flash('Task successfull.')
    res.redirect('/home')
    return

}) 

module.exports = router