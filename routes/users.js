var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user_helper');

/* GET users listing. */
router.get('/', function (req, res, next) {
    userHelper.getCarousal().then((carousal_arr)=>{
        userHelper.getEvent().then((events)=>{
            userHelper.getNews().then((news)=>{
                res.render('users/index',{carousal_arr,events,news})
            })
        })
    })
    
});

router.get('/donate-blood',function (req,res){
    res.render('users/blood-donation-form')
})
router.get('/news/:newsInd',function (req,res){
    let newsInd = req.params.newsInd;
    userHelper.getNewsDetails(newsInd).then((news)=>{
        res.render('users/news',{news, admin:false})
    }) 
})

router.post('/donate-blood',function (req,res){
    console.log(req.body);
    res.redirect('/');
})

module.exports = router;