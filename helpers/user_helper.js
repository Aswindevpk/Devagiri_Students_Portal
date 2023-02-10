var db = require('../config/connection').get()
var names = require('../config/names')

module.exports = {
    getCarousal: () => {
        return new Promise(async (resolve, reject) => {
            col = db.collection('contents')
            var carousal_arr = await col.aggregate([
                { $limit: 1 },
                { $project: { carousal: 1 } }
            ]).toArray();
            carousal_arr = carousal_arr[0].carousal
            resolve(carousal_arr)
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

            // // this function format the date 
            // function formatDate(dateString) {
            //     var date = new Date(dateString.split("-").reverse().join("-")),
            //         days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            //         months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            //         dayName = days[date.getUTCDay()],
            //         monthName = months[date.getUTCMonth()],
            //         day = date.getUTCDate(),
            //         year = date.getUTCFullYear();

            //     return `${dayName}, ${monthName} ${day}`;
            // }


            resolve(events)
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
    getNewsDetails: (newsInd) => {
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
            resolve(news)
        })
    }
}