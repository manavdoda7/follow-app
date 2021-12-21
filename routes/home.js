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


    const suggestionsMap = new Map()
    for(i=0;i<following.length;i++) {
        let friendFollowing
        try{
            friendFollowing = await fetchFollowing(following[i].followed)
            friendFollowing = friendFollowing[0]
        } catch(err) {
            console.log(`Couldn't fetch following for ${following[i].followed}`);
            friendFollowing = []
        }
        for(j=0;j<friendFollowing.length;j++) {
            if(suggestionsMap.has(friendFollowing[j].followed)) suggestionsMap.set(friendFollowing[j].followed, suggestionsMap.get(friendFollowing[j].followed)+2)
            else suggestionsMap.set(friendFollowing[j].followed, 2)
        } 
    }
    for(i=0;i<followers.length;i++) {
        if(suggestionsMap.has(followers[i].followedBy)) suggestionsMap.set(followers[i].followedBy, suggestionsMap.get(followers[i].followedBy)+5)
        else suggestionsMap.set(followers[i].followedBy, 5) 
        let friendFollowers
        try{
            friendFollowers = await fetchFollowers(followers[i].followedBy)
            friendFollowers = friendFollowers[0]
        } catch(err) {
            console.log(`Couldn't fetch followers for ${followers[i].followedBy}`);
            friendFollowers = []
        }
        for(j=0;j<friendFollowers.length;j++) {
            if(suggestionsMap.has(friendFollowers[j].followedBy)) suggestionsMap.set(friendFollowers[j].followedBy, suggestionsMap.get(friendFollowers[j].followedBy)+1)
            else suggestionsMap.set(friendFollowers[j].followedBy, 1)
        } 
    }
    for(i=0;i<following.length;i++) {
        suggestionsMap.delete(following[i].followed)
    }
    suggestionsMap.delete(req.session.user.username)
    const mapSort = new Map([...suggestionsMap.entries()].sort((a, b) => b[1] - a[1]));
    suggArr = []
    i=0
    for(const[key, value] of mapSort.entries()) {
        i++
        suggArr.push(key)
        if(i==10) break
    }
    console.log(suggArr);
    res.render('home', {message: req.flash('message'), followers:followers, following:following, suggestions:suggArr})
})

module.exports=router