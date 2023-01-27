const request = require('request')

const api_key = '4a2db7b931133c7cc7b6be50e8287dda'
const base_url = 'https://api.openweathermap.org/data/2.5/weather'

const forecast = (latitude, longitude, callback) => {
  // const url = 'https://api.darksky.net/forecast/9d1465c6f3bb7a6c71944bdd8548d026/' + latitude + ',' + longitude
  const url = `${base_url}?lat=${latitude}&lon=${longitude}&appid=${api_key}`
  request({ url, json: true }, (error, { body }) => {
    if (error) {
        callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
        callback('Unable to find location', undefined)
    } else {
      const weather = body.weather[0]
        // callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degress out. There is a ' + body.currently.precipProbability + '% chance of rain.')
        callback(undefined, weather.description)
    }
  })
}

module.exports = forecast