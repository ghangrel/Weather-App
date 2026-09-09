const cp = '39001'
const pais = 'ES'

fetch (`https://api.zippopotam.us/${pais}/${cp}`)
.then(response => response.json())
.then(geo => {
    const lat = geo.places[0].latitude
    const lon = geo.places[0].longitude


    console.log (`${lat}, ${lon}`)
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=precipitation_probability`)
})
.then(response => response.json())
.then(clima => {
    console.log (`Temperatura actual: ${clima.current.temperature_2m} °C`)

    const horaActual = new Date().getHours()

    const climat = clima.current.weather_code
    const lluvia = clima.hourly.precipitation_probability[horaActual]


    console.log (`Código estado: ${climat}`)
    console.log (`Probabilidad de Lluvia: ${lluvia}`)

    const temp = document.querySelector('.temp')
    const prob = document.querySelector('.prob')

temp.innerText =`${clima.current.temperature_2m}°`
prob.innerText =`${lluvia}`

})
.catch(error => console.error('Error:', error))

