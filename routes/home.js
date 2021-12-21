const express=require('express')
const { fetchFollowers, fetchFollowing } = require('../models/user')
const router = express.Router()

router.get('/', async (req, res)=>{
    if(req.session.user===undefined) {
        req.flash('message', 'Please login first.')
        res.redirect('/login')
        return
    }
    let followers
    try{
        followers = await fetchFollowers(req.session.user.username)
        followers = followers[0]
    } catch(err) {
        console.log('Error in fetching followers.', err);
        followers=[{followedBy: 'Error fetching followers.'}]
    }
    let following
    try{
        following = await fetchFollowing(req.session.user.username)
        following = following[0]
    } catch(err) {
        console.log('Error in fetching following', err);
        following = [{followed: 'Error fetching following'}]
    }
    res.render('home', {message: req.flash('message'), followers:followers, following:following})
})

module.exports=router