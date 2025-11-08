import http from 'node:http'
import { TLSSocket } from 'node:tls'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { getData, type Destination } from './data.js'

type LocationType = 'country' | 'continent'

export const getDataByPathParams = (
  data: Destination[],
  locationType: LocationType,
  locationName: string,
): Destination[] => {
  const normalizedLocation = locationName.toLowerCase()

  return data.filter((destination) => {
    return destination[locationType].toLowerCase() === normalizedLocation
  })
}

export const sendJSONResponse = (
  res: ServerResponse,
  statusCode: number,
  payload: unknown,
) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}

const PORT = 8000

const buildUrl = (req: IncomingMessage): URL => {
  const socket = req.socket
  const isEncrypted = socket instanceof TLSSocket
  const protocol = isEncrypted ? 'https' : 'http'
  const host = req.headers.host ?? `localhost:${PORT}`

  return new URL(req.url ?? '/', `${protocol}://${host}`)
}

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  const destinations = await getData()
  const urlObj = buildUrl(req)
  const pathname = urlObj.pathname
  const method = req.method ?? 'GET'
  const pathSegments = pathname.split('/').filter(Boolean)
  const queryObj = Object.fromEntries(urlObj.searchParams) as Record<
    string,
    string
  >

  console.log(urlObj)
  console.log(queryObj)

  if (pathname === '/api' && method === 'GET') {
    sendJSONResponse(res, 200, destinations)
    return
  }

  if (
    method === 'GET' &&
    pathSegments[0] === 'api' &&
    pathSegments[1] === 'continent' &&
    pathSegments[2]
  ) {
    const filteredData = getDataByPathParams(
      destinations,
      'continent',
      pathSegments[2],
    )
    sendJSONResponse(res, 200, filteredData)
    return
  }

  if (
    method === 'GET' &&
    pathSegments[0] === 'api' &&
    pathSegments[1] === 'country' &&
    pathSegments[2]
  ) {
    const filteredData = getDataByPathParams(
      destinations,
      'country',
      pathSegments[2],
    )
    sendJSONResponse(res, 200, filteredData)
    return
  }

  sendJSONResponse(res, 404, {
    error: 'not found',
    message: 'The requested route does not exist',
  })
}

const server = http.createServer((req, res) => {
  void handleRequest(req, res)
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
