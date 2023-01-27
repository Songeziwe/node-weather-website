//  This file is executing on the backend i.e server

const EXPRESS = require('express')
const PATH = require('path')
const hbs = require('hbs')
const forecast =  require('./utils/forecast')
const geocode = require('./utils/geocode')

const APP = EXPRESS()
const PORT = process.env.PORT || 3000

// define paths for express config
const INDEXHTMLPATH = PATH.join(__dirname, '../public')
const VIEWSPATH = PATH.join(__dirname, '../templates', 'views')
const PARTIALSPATH = PATH.join(__dirname, '../templates', 'partials')
const WEBSITETITLE = 'Weather App'

// setup handlebars engine and views location
APP.set('view engine', 'hbs')
APP.set('views', VIEWSPATH)
hbs.registerPartials(PARTIALSPATH)

// setup static directory to serve
APP.use(EXPRESS.static(INDEXHTMLPATH))

// route handler
APP.get('', (req, res) => {
  res.render('index', {
    websiteTitle: WEBSITETITLE,
    name: 'John Doe',
    createdBy: 'Zibondiwe Production Inc'
  })
})

APP.get('/about', (req, res) => {
  res.render('about', { websiteTitle: WEBSITETITLE, createdBy: 'Zibondiwe Production Inc' })
})

APP.get('/help', (req, res) => {
  res.render('help', {
    websiteTitle: WEBSITETITLE,
    message: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur quidem architecto minus ratione optio voluptas fuga quam ipsam? Soluta adipisci officiis velit ad nam ab rerum sit laborum odio neque!',
    createdBy: 'Zibondiwe Production Inc'
  })
})

APP.get('/help/*', (req, res) => {
  res.render('404', {
    message: 'Help Article Not Found'
  })
})

// route handler
APP.get('/weather', (req, res) => {
  const address = req.query.address
  if(!address) {
    return res.send({
      error: 'Please provide an address on the url or query string.'
    })
  }

  // get coordinates using address from the query string
  geocode(address, (error, data) => {
    if(error) {
      return res.send({ error })
    }
    
    const { latitude, longitude, location } = data

    // get weather forecast
    forecast(latitude, longitude, (error, data) => {
      if(error)
        return res.send({ error })
      res.send({
        forecast: data.description,
        currentTemperature: data.currentTemperature,
        feelsLike: data.feelsLike,
        location,
        address: req.query.address
      })
    })
  })
})

APP.get('/products', (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: 'You must provide a search term.'
    })
  }
  res.send({
    products: []
  })
})

// match everything that isn't listed up above
APP.get('*', (req, res) => {
  res.render('404', {
    message: 'Page Not Found'
  })
})

APP.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`)
})