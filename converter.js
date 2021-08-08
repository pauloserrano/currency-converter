const axios = require('axios')


const getExchangeRate = async (fromCurrency, toCurrency) => {
    const res = await axios.get('http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1')

    const rates = res.data.rates
    const euro = 1 / rates[fromCurrency]
    const exchangeRate = euro * rates[toCurrency]

    if (isNaN(exchangeRate)) throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency}`)

    return exchangeRate
}


const getCountries = async (toCurrency) => {
    try {
        const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`)
    
    } catch (err) {
        throw new Error(`Unable to get countries that use ${toCurrency}`)
    }

    return res.data.map(country => country.name)
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency)
    const countries = await getCountries(toCurrency)
    const convertedAmount = (amount * exchangeRate).toFixed(2)

    return `${fromCurrency} ${amount} = ${toCurrency} ${convertedAmount}. You can spent these in the following countries: ${countries}`
}

convertCurrency('USDd', 'EUR', 69)
.then(message => console.log(message))
.catch(err => console.error(err.message))
