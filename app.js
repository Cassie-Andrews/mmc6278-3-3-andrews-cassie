require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const port = 3000;
const { getJobs, getCityInfo } = require('./util.js') // import getCityInfo and getJobs functions from util.js

app.use(express.static('public')) // Statically serve the public folder
app.get('/api/city/:city', async (req, res) => { // declare the GET route /api/city/:city
    const city = req.params.city;

    try {
        // This endpoint should call getCityInfo and getJobs
        const cityInfo = await getCityInfo(city);
        const jobs = await getJobs(city);
        
        // If no city info AND jobs are found,
        // the endpoint should return a 404 status
        if (!cityInfo && !jobs) {
            return res.status(404).json({
                success: false,
                error: "No results found"
            })
        }

        // No city info found
        if (!cityInfo) {
            return res.status(200).json({
                jobs: jobs,
                success: false,
                cityInfo: false
            })
        }

        if (!jobs) {
            return res.status(200).json({
                success: false,
                cityInfo: cityInfo,
                jobs: false
            })
        }

        // If city info or jobs are found, return the result as JSON.
        res.json({
        // The returned JSON object should have two keys:
            cityInfo,// cityInfo (with value of the getCityInfo function)
            jobs// jobs (with value of the getJobs function)
    })

    } catch (error) {
        console.log(error);
        return res.status().json({
            success: false,
            error: error
        })
    }
})

module.exports = app
