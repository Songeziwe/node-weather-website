// This file is executing on the browser i.e client

const base_url = 'http://localhost:3000'

// make http request from the client side to the server
const getData = async (address = 'Boston', callback) => {
  fetch(`/weather?address=${ address }`)
  .then(res => {
    res.json().then(data => {
      if(data.error) callback({ error: data.error, data: undefined }) 
      else callback({ error: undefined, data }) 
    })
  })
}

const form = document.querySelector('main > form')
const inputField = document.querySelector('input')
const forecastElement = document.getElementById('forecast')
const locationElement = document.getElementById('location')
const currentTemperature = document.getElementById('current-temp')
const feelsLikeTemperature = document.getElementById('feels-like')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const userInput = inputField.value
  forecastElement.textContent = locationElement.textContent = null

  if(userInput) {
    forecastElement.textContent = 'Loading...'
    getData(userInput, (res) => {
      if(!res.error) {
        inputField.value = null
        forecastElement.textContent = `Sky: ${res.data.forecast}`
        currentTemperature.textContent = `Temperature: ${res.data.currentTemperature}`
        feelsLikeTemperature.textContent = `Feels Like: ${res.data.feelsLike}`
        locationElement.textContent = `Location: ${res.data.location}`
      } else forecastElement.textContent = res.error
    })
  } else alert('Please enter an address')
})
