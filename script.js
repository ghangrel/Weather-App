//variables de entrada
const cp = '39001'
const pais = 'ES'

//servicios / apis (datos)

//fetch de longitud y latitud a través de cp

async function coordenadas(cp, pais) {
    const res = await fetch (`https://api.zippopotam.us/${pais}/${cp}`)
    if (!res.ok) throw new Error('Error al obtener las coordenadas')
    const data = await res.json()

    return {
        lat: data.places[0].latitude,
        lon: data.places[0].longitude,
        ciudad: data.places[0]['place name']
    }
}

// fetch datos del clima usando las coordenadas anteriores
async function clima (lat, lon) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,precipitation_probability&timezone=auto`)
    if (!res.ok) throw new Error('Error al obtener datos meteorológicos')
    return await res.json()
}

// función hora que se actualiza
function actualizarReloj() {
    const ahora = new Date()
    const hora = ahora.toLocaleTimeString( 'es-ES', { hour: '2-digit', minute: '2-digit'})
    const dia = ahora.toLocaleDateString( 'es-ES', { day: '2-digit'})
}


// fecha y hora actuales (captura y conversión)

/*const ahora = new Date()
const horaActual = ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
const dia = ahora.toLocaleDateString([], {day: '2-digit'})
const mes = ahora.toLocaleDateString('es-ES', { month: 'long'})
const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1)
const fecha = `${dia}/${mesCap}`
console.log(horaActual)
console.log(fecha)*/

//función para la línea de 6 horas
function renderHours(datosClima) {
    const hoursContainer = document.querySelector('.hours-temp')
    const actual = new Date().getHours()

    let htmlContent = ''

    for (let i = 0; i < 6; i++) {
        const indiceHora = (actual + i) % 24
        const hora = `${String(indiceHora)}`
        const temperatura = `${datosClima.hourly.temperature_2m[indiceHora]}°`

        htmlContent +=`
        <div class="temp-h">
        <p>-${hora}-</p>
        <h3>${temperatura}</h3>
      </div>
      `
    }
    hoursContainer.innerHTML = htmlContent
}

// función para cambiar el fondo

function changeBack(code) {
    const mainElement = document.querySelector('main')
    let imagenFondo = ''

    switch (true) {
        case (code === 0):
            imagenFondo = 'url(img/soleado.jpg)'
            break

        case (code >= 1 && code <= 2):
            imagenFondo = 'url(img/parcialmenteNublado.jpg)'
            break

        case (code >= 3 && code <=50):
            imagenFondo = 'url(img/nublado.jpg)'
            break

        default:
            imagenFondo = 'url(img/lluviaFuerte.jpg)'
    }

    if (mainElement) {
        mainElement.style.backgroundImage = imagenFondo
    }
}

// función principal, sustituir elementos html de manera dinámica
async function main () {
    try {
        const coords = await coordenadas(cp, pais)
        const datosClima = await clima(coords.lat, coords.lon)
        console.log(coords.ciudad)
        console.log(datosClima)

        renderHours(datosClima)
        const code = datosClima.current.weather_code

        const ciudad = document.querySelector('h1')
        ciudad.textContent = coords.ciudad

        const date = document.querySelector('.date')
        date.textContent = fecha

        const time = document.querySelector('.time')
        time.textContent = horaActual

        const temp = document.querySelector('.temp')
        temp.textContent = `${datosClima.current.temperature_2m}°C`

        const lluvia = document.querySelector('.prob')
        const hora = ahora.getHours()
        lluvia.textContent = `${datosClima.hourly.precipitation_probability[hora]}%`

        changeBack(code)

        /*const code = datosClima.current.weather_code
        console.log ('código de clima actual ', code)*/

    } catch (error) {
        console.error('Ocurrió un error: ', error.message)
    }
}

main()
