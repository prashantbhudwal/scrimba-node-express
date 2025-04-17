import http from 'node:http'
import { getData } from './data.js'
export const getDataByPathParams = (data, locationType, locationName) => {
  return data.filter((destination) => {
    return (
      destination[locationType].toLowerCase() === locationName.toLowerCase()
    )
  })
}

export const sendJSONResponse = (res, statusCode, payload) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}
const PORT = 8000

const server = http.createServer(async (req, res) => {
  const destinations = await getData()

  const urlObj = new URL(req.url, `http://${req.headers.host}`)

  console.log(urlObj)

  const queryObj = Object.fromEntries(urlObj.searchParams)

  if (req.url === '/api' && req.method === 'GET') {
    let filteredDestinations = destinations

    console.log(queryObj)
    // update filteredDestinations

    sendJSONResponse(res, 200, filteredDestinations)
  } else if (req.url.startsWith('/api/continent') && req.method === 'GET') {
    const continent = req.url.split('/').pop()
    const filteredData = getDataByPathParams(
      destinations,
      'continent',
      continent
    )
    sendJSONResponse(res, 200, filteredData)
  } else if (req.url.startsWith('/api/country') && req.method === 'GET') {
    const country = req.url.split('/').pop()
    const filteredData = getDataByPathParams(destinations, 'country', country)
    sendJSONResponse(res, 200, filteredData)
  } else {
    res.setHeader('Content-Type', 'application/json')
    sendJSONResponse(res, 404, {
      error: 'not found',
      message: 'The requested route does not exist',
    })
  }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
