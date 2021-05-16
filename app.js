const express = require('express');
const cors = require('cors');
const request = require('request');
const port = 3000


// Inicializamos la app
const app = express()
app.use(cors())


const CLIENT = 'AfRllPl7htgLjf7B3XBTvZUr4NxxFMa6c6XVGgTBicBTwABl195QML4wUN5M2mNbsnAHbeerkggHcAi7';
const SECRET = 'EOeLJX9mbigK5S0209WaDkyHqg0c8xhE5y7a3_w6PHLuNbiR3jp962e2pSuwec8Uf6AO-tE3FuXq6Qvr';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const auth = { user: CLIENT, pass: SECRET }


// ROUTES

const createPayment = (req, res) => {
    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD', //https://developer.paypal.com/docs/api/reference/currency-codes/
                value: '150'
            }
        }],
        application_context: {
            brand_name: `MiTienda.com`,
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `http://localhost:3000/execute-payment`,
            cancel_url: `http://localhost:3000/cancel-payment`
        }
    }

    request.post(`${PAYPAL_API}/v2/checkout/orders`, {
        auth, // Va enviar por el lado del header el AUTH
        body, // En el body vamos a pasar este objeto
        json: true // Tipo de respuesta que queremos
    }, (err, response) => {
        res.json({ data: response.body })
    })
}
// Definimos la ruta de la función anterior
app.post('/create-payment', createPayment)


// Esta funcion captura el dinero realmente
const executePayment = (req, res) => {
    const token = req.query.token;

    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        res.json({ data: response.body })  
    })
}

// Definimos la ruta de la función anterior
app.get(`/execute-payment`, executePayment)


app.listen(port, () => {
    console.log('Comencemos a generar dinero => https://localhost:3000')
})