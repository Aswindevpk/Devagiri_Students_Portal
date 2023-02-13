var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user_helper');

/* GET users listing. */
router.get('/', function (req, res, next) {
    userHelper.getCarousal().then((carousal_arr)=>{
        userHelper.getEvent().then((events)=>{
            userHelper.getNews().then((news)=>{
                userHelper.getBloodReq().then((blood_req)=>{
                    res.render('users/index',{carousal_arr,events,news,blood_req})
                })
            })
        })
    })
    
});

router.get('/donate-blood',function (req,res){
    userHelper.getBloodReq().then((blood_req)=>{
        res.render('users/blood-donation-form',{admin:false, blood_req})
    })
})
router.get('/news/:newsInd',function (req,res){
    let newsInd = req.params.newsInd;
    userHelper.getNewsDetails(newsInd).then((news)=>{
        res.render('users/news',{news, admin:false})
    }) 
})

router.post('/donate-blood',function (req,res){
    let donor_details = req.body
    userHelper.addDonor(donor_details).then(()=>{
        res.redirect('/');
    })
    
})

module.exports = router;