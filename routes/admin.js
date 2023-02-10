var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin_helper');
var fs = require('fs');


// verify that the user is login or not and continue to the function
const verifyLogin = (req, res, next) => {
    let loggedIn = req.session.loggedIn
    if (loggedIn) {
        next()
    } else {
        res.redirect('/admin/login')
    }
}



router.get('/', verifyLogin, function (req, res, next) {
    adminHelper.getAllCarousal().then((carousal_arr) => {
        adminHelper.getEvent().then((events) => {
            adminHelper.getNews().then((news) => {
                res.render('admin/index', { admin: true, carousal_arr, events, news })
            })
        })
    })
});

router.get('/login', function (req, res, next) {
    res.render('admin/login', { admin: true })
});

router.post('/login', (req, res) => {
    const adminData = req.body
    adminHelper.doLogin(adminData).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            res.redirect('/admin')
            console.log('hi');
        } else {
            res.render('admin/login', { admin: true, error: response.error })
        }
    })
})




router.post('/add-carousal', verifyLogin, (req, res) => {
    if (req.files) {
        var image = req.files.image
        adminHelper.addCarousal().then((image_name) => {
            image.mv('./public/carousel/' + image_name + '.jpg', (err, done) => {
                if (!err) {
                    res.redirect('/admin')
                } else {
                    console.log(err)
                }
            })
        })

    } else {
        res.redirect('/admin')
    }

});

router.get('/edit-event/:eventInd', verifyLogin, (req, res) => {
    let eventInt = req.params['eventInd'];
    adminHelper.editEvent(eventInt).then((event) => {
        event.conditions = event.conditions.join('\n');
        res.render('admin/edit-event', { admin: true, event })
    })
});

router.post('/edit-event', verifyLogin, (req, res) => {
    let event = req.body;
    event.conditions = event.conditions.split('\n');
    adminHelper.editEventCnf(event).then(() => {
        res.redirect('/admin')
    })
});


router.post('/add-event', verifyLogin, (req, res) => {
    var event = req.body;
    event.datetime= new Date(event.datetime)
    event.conditions = event.conditions.split('\n');
    adminHelper.addEvent(event).then(() => {
        res.redirect('/admin')
    })
});
router.get('/logout', verifyLogin, (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
});

router.get('/delete-event/:event_name', verifyLogin, (req, res) => {
    let event_name = req.params.event_name
    adminHelper.removeEvent(event_name).then(() => {
        res.redirect('/admin')
    })
})

router.get('/delete-carousal/:carousal_name', verifyLogin, (req, res) => {
    let carousal_name = req.params.carousal_name
    adminHelper.removeCarousal(carousal_name).then((carousal_name) => {
        const filepath = "C:\\Users\\DELL\\Desktop\\college website\\public\\carousel\\" + carousal_name + '.jpg';
        fs.unlink(filepath, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/admin')
            }
        });
    })

}),

    router.post('/add-news', verifyLogin, (req, res) => {
        if (req.files) {
            news = req.body;
            news.img = news.title.split(' ').join('_');
            var image = req.files.image
            adminHelper.addNews(news).then(() => {
                image.mv('./public/news_img/' + news.img + '.jpg', (err, done) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        console.log(err)
                    }
                })
            })

        }
    }),

    router.get('/delete-news/:title', verifyLogin, (req, res) => {
        let title = req.params.title
        adminHelper.removeNews(title).then((title) => {
            let img = title.split(' ').join('_');
            const filepath = "C:\\Users\\DELL\\Desktop\\college website\\public\\news_img\\" + img + '.jpg';
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/admin')
                }
            });
        })
    }),

    router.get('/edit-news/:newsInd', verifyLogin, (req, res) => {
        let newsInt = req.params['newsInd'];
        adminHelper.editNews(newsInt).then((news) => {
            res.render('admin/edit-news', { admin: true, news })
        })
    });

router.post('/edit-news', verifyLogin, (req, res) => {
    if (req.files) {
        let news = req.body;
        var image = req.files.image;
        news.img = news.title.split(' ').join('_');
        adminHelper.editNewsCnf(news).then((oldNews) => {
            const oldImgPath = "C:\\Users\\DELL\\Desktop\\college website\\public\\news_img\\" + oldNews.img + '.jpg';
            fs.unlink(oldImgPath, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    image.mv('./public/news_img/' + news.img + '.jpg', (err, done) => {
                        if (!err) {
                            res.redirect('/admin')
                        } else {
                            console.log(err)
                        }
                    })
                }
            });
        })
    } else {
        let news = req.body;
        news.img = news.title.split(' ').join('_');
        adminHelper.editNewsCnf(news).then((oldNews) => {
            fs.rename('./public/news_img/' + oldNews.img + '.jpg','./public/news_img/' + news.img + '.jpg', (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.redirect('/admin')
                }
            });
        })
    }


});


module.exports = router;