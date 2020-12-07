require('dotenv').config()

const { Client } = require('pg')
const axios = require('axios')

const LATITUDE = process.env.LATITUDE || 40.70098574912939
const LONGITUDE = process.env.LONGITUDE || -73.9837906003035
const APIKEY = process.env.APIKEY
const INTERVAL = process.env.INTERVAL || 1800

if (APIKEY === undefined) {
  console.error('No API Key set.  Exiting.')
} else {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${APIKEY}`

  // Poll Function
  const pollOWM = () => {
    axios
      .get(url)
      .then((response) => {
        if (response && response.data && response.data.main) {
          const main = response.data.main
          return main
        }
      })
      .then((data) => {
        console.log(data)
        const client = new Client()
        client.connect().then(() => {
          const query = `
            INSERT INTO temps (temp, feels_like, temp_min, temp_max, pressure, humidity, latitude, longitude, units)
            VALUES (${data.temp},${data.feels_like},${data.temp_min},${data.temp_max},
            ${data.pressure},${data.humidity},${LATITUDE},${LONGITUDE},'imperial')`
          // Execute INSERT command
          client.query(query, (err, results) => {
            if (err) {
              console.error(`An error happened when trying to run:\n${query}`)
              console.error(err)
              client.end()
            } else {
              console.log(`Insert successful:\n${query}`)
              client.end()
            }
          })
        })
      })
  }
  pollOWM()
  console.log(`Querying ${url} every ${INTERVAL} seconds...`)
  setInterval(pollOWM, INTERVAL * 1000)
}
