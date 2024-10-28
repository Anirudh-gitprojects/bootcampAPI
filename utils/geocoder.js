const NodeGeocoder=require('node-geocoder')
console.log('env',process.env.PORT)
const options={
    provider:'mapquest',
    httpAdapter:'https',
    apiKey:'JujAkXhGXyOsqgR83WTTJJ2dQQVJXalF',
    formatter:null
}


const geocoder=NodeGeocoder(options)

module.exports=geocoder;