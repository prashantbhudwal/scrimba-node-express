import type { IncomingMessage, ServerResponse } from 'node:http'

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void

export const routes: Record<string, RouteHandler> = {
  'GET /': function (req, res) {
    res.end('Root Route HIT')
  },
  'GET /hello': function (req, res) {
    res.end('hello world')
  },
}
