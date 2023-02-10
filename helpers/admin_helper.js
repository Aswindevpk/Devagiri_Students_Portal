var db = require('../config/connection').get()
var names = require('../config/names')
var bcrypt = require('bcrypt')

module.exports = {
    doLogin: (admin) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            col = db.collection('login')
            let user = await col.findOne({ user: admin.user_name })             //take data from the database
            if (user) {       //if user exist
                bcrypt.compare(admin.password, user.pass).then((status) => {     //compares the password correct or not
                    if (status) {             //if password is correct  
                        console.log('hi');
                        response.status = true
                        resolve(response)
                    } else {              //if password is not correct
                        response.status = false
                        response.error = "Incorrect Password !"
                        resolve(response)
                    }
                })

            } else {  //if user does not exist
                response.status = false
                response.error = "user does not exist !"
                resolve(response)
            }
        })
    },

    getAllCarousal: () => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            carousal_arr = await col.aggregate([
                { $limit: 1 },
                { $project: { carousal: 1 } }
            ]).toArray();
            resolve(carousal_arr[0].carousal)
        })
    },
    addCarousal: () => {
        return new Promise(async (resolve, reject) => {
            // extract the carousel contents 
            col = db.collection('contents')
            const carousal = await col.aggregate([
                { $limit: 1 },
                { $project: { carousal: 1 } }
            ]).toArray();

            var carousal_array = carousal[0].carousal
            var length = carousal_array.length + 1;
            length = length.toString();
            console.log(length, carousal_array);

            // add the name to the database
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $push: { carousal: length } })

            resolve(length)

        })
    },
    removeCarousal: (carousal_name) => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $pull: { carousal: carousal_name } }
            )
            resolve(carousal_name)
        })
    },
    addEvent: (event) => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $push: { events: event } }
            )
            resolve()
        })
    },
    getEvent: () => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            var events = await col.aggregate([
                { $limit: 1 },
                { $project: { events: 1 } }
            ]).toArray();
            events = events[0].events
            resolve(events)
        })
    },
    removeEvent: (event_name) => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $pull: { events: { name: event_name } } }
            )
            resolve()
        })
    },
    editEvent: (eventInd) => {
        return new Promise(async (resolve, reject) => {
            eventInd = parseInt(eventInd)
            col = db.collection('contents')
            let event = await col.aggregate([
                { $match: { name: "devagiri" } },
                {
                    $project: {
                        event: { $arrayElemAt: ["$events", eventInd] }
                    }
                }
            ]).toArray()
            event = event[0].event;
            event.index = eventInd;
            resolve(event)
        })
    },
    editEventCnf: (event) => {
        return new Promise(async (resolve, reject) => {
            let eventInd = parseInt(event.index);
            delete event.index;
            col = db.collection('contents')
            await col.updateOne(
                {},
                { $set: { [`events.${eventInd}`]: event } }
            )

            resolve()
        })
    },
    addNews: (news) => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $push: { dailynews: news } }
            )
            resolve()
        })
    },
    getNews: () => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            var dailynews = await col.aggregate([
                { $limit: 1 },
                { $project: { dailynews: 1 } }
            ]).toArray();
            dailynews = dailynews[0].dailynews
            resolve(dailynews)
        })
    },
    removeNews: (title) => {
        return new Promise(async (resolve, reject) => {
            console.log(title);
            col = db.collection('contents')
            await col.updateOne(
                { name: names.name },
                { $pull: { dailynews: { title: title } } }
            )
            resolve(title)
        })
    },
    editNews: (newsInd) => {
        return new Promise(async (resolve, reject) => {
            newsInd = parseInt(newsInd)
            col = db.collection('contents')
            let news = await col.aggregate([
                { $match: { name: "devagiri" } },
                {
                    $project: {
                        news: { $arrayElemAt: ["$dailynews", newsInd] }
                    }
                }
            ]).toArray()
            news = news[0].news;
            news.index = newsInd;
            resolve(news)
        })
    },
    editNewsCnf: (news) => {
        return new Promise(async (resolve, reject) => {
            let newsInd = parseInt(news.index);
            col = db.collection('contents')
            let oldNews = await col.aggregate([
                { $match: { name: "devagiri" } },
                {
                    $project: {
                        news: { $arrayElemAt: ["$dailynews", newsInd] }
                    }
                }
            ]).toArray()
            oldNews = oldNews[0].news;

            delete news.index;
            col = db.collection('contents')
            await col.updateOne(
                {},
                { $set: { [`dailynews.${newsInd}`]: news } }
            )
            resolve(oldNews)
        })
    },

}