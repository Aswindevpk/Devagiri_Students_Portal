var express = require('express');
var router = express.Router();
var db = require('../config/connection').get()
var names = require('../config/names')
var bcrypt = require('bcrypt')

// verify that the user is login or not and continue to the function
const verifyLogin = (req, res, next) => {
    let loggedIn = req.session.loggedIn
    if (loggedIn) {
        next()
    } else {
        res.redirect('/blood_donation/login')
    }
}

/* GET users listing. */
router.get('/', verifyLogin, async (req, res) => {
    col = db.collection('contents')
    let blood_req = await col.aggregate([
        { $limit: 1 },
        { $project: { blood_req: 1 } }
    ]).toArray();
    blood_req = blood_req[0].blood_req
    res.render('blood_donation/index', { admin: true, blood_req })
});

//login 
router.get('/login', function (req, res, next) {
    res.render('blood_donation/login', { admin: true })
});

router.post('/login', async (req, res) => {
    const adminData = req.body
    let response = {}
    col = db.collection('login')
    let user = await col.findOne({ user: adminData.user_name })             //take data from the database
    if (user) {       //if user exist
        bcrypt.compare(adminData.password, user.pass).then((status) => {     //compares the password correct or not
            if (status) {             //if password is correct  
                console.log('hi');
                response.status = true
                doLogin(response)
            } else {              //if password is not correct
                response.status = false
                response.error = "Incorrect Password !"
                doLogin(response)
            }
        })

    } else {  //if user does not exist
        response.status = false
        response.error = "user does not exist !"
        doLogin(response)
    }

    function doLogin(response){
        if (response.status) {
            req.session.loggedIn = true;
            res.redirect('/blood_donation')
        } else {
            res.render('blood_donation/login', { admin: true, error: response.error })
        }
    }
    
}),




    router.post('/add', verifyLogin, async (req, res) => {
        const blood_req = req.body
        col = db.collection('contents')
        await col.updateOne(
            { name: names.name },
            { $push: blood_req })
        res.redirect('/blood_donation')
    });

router.get('/delete/:blood_gr', verifyLogin, async (req, res) => {
    const blood_gr = req.params.blood_gr
    col = db.collection('contents')
    await col.updateOne(
        { name: names.name },
        { $pull: { blood_req: blood_gr } }
    )
    res.redirect('/blood_donation')
});




module.exports = router;