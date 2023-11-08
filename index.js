const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5000
const router = require('./routers')

app.use(express.json({strict: false}))
app.use('/api/v1', router) //Grouping API

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})