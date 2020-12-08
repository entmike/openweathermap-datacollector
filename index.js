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
        if (response && response.data) {
          const payload = {
            // Metadata
            latitude: LATITUDE,
            longitude: LONGITUDE,
            units: 'imperial',
            visibility: null,
            name: '',

            // Main
            main_temp: null,
            main_feels_like: null,
            main_pressure: null,
            main_humidity: null,
            main_temp_min: null,
            main_temp_max: null,
            main_sea_level: null,
            main_grnd_level: null,
            // Clouds
            clouds_all: null,
            // Rain
            rain_1h: null,
            rain_3h: null,
            // Snow
            snow_1h: null,
            snow_3h: null,
            // Wind
            wind_speed: null,
            wind_deg: null,
            wind_gust: null,
            // Weather
            weather_id: null,
            weather_main: '',
            weather_description: '',
            weather_icon: '',
          }

          payload.name = response.data.name
          if (response.data.visibility !== undefined)
            payload.visibility = response.data.visibility

          const categories = [
            'main',
            'clouds',
            'wind',
            'clouds',
            'rain',
            'snow',
          ]

          categories.map((category) => {
            if (response.data[category]) {
              for (const key in response.data[category]) {
                if (payload[`${category}_${key}`] !== undefined)
                  payload[`${category}_${key}`] = response.data[category][key]
              }
            }
            return category
          })
          // Weather (array so a bit different)
          if (response.data.weather && response.data.weather.length > 0) {
            const weather = response.data.weather[0]
            for (const key in weather) {
              if (payload[`weather_${key}`] !== undefined)
                payload[`weather_${key}`] = weather[key]
            }
          }
          return payload
        }
      })
      .then((data) => {
        const client = new Client()
        client.connect().then(() => {
          const query = `
            INSERT INTO temps (latitude, longitude, units, name, visibility,
              main_temp, main_feels_like, main_pressure, main_humidity, main_temp_min, main_temp_max, main_sea_level, main_grnd_level,
              clouds_all, rain_1h, rain_3h, snow_1h, snow_3h,
              wind_speed, wind_deg, wind_gust,
              weather_id, weather_main, weather_description, weather_icon
            )
            VALUES (
              ${LATITUDE},${LONGITUDE},'${data.units}', '${data.name}', ${data.visibility},
              ${data.main_temp},${data.main_feels_like},${data.main_pressure},${data.main_humidity},${data.main_temp_min},${data.main_temp_max},${data.main_sea_level},${data.main_grnd_level},
              ${data.clouds_all},${data.rain_1h},${data.rain_3h},${data.snow_1h},${data.snow_3h},
              ${data.wind_speed}, ${data.wind_deg}, ${data.wind_gust},
              ${data.weather_id}, '${data.weather_main}', '${data.weather_description}', '${data.weather_icon}'
            )`
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
