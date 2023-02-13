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
    getBloodReq:()=>{
        return new Promise( async (resolve, reject) => {
            col = db.collection('contents')
            let blood_req = await col.aggregate([
                { $limit: 1 },
                { $project: { blood_req: 1 } }
            ]).toArray();
            blood_req = blood_req[0].blood_req
            resolve(blood_req)
        })
    },
    addDonor:(donor_details)=>{
        return new Promise(async(resolve, reject) => {
            col = db.collection("blood_donors")
            await col.insertOne(donor_details)
            resolve()
        })
    },
    getEvent:() => {
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