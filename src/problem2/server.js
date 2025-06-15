import fs from 'node:fs/promises'
import express from 'express'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

app.use(express.json())

// Serve HTML
app.post('/get-rate', async (req, res) => {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json')
    const data = await response.json()

    console.log(req.body)

    const { currency: currentCurrency, value, convertToCurrency } = req.body

    const currentRate = data.find(
      ({ currency }) => currency === currentCurrency.toUpperCase(),
    ).price

    const toRate = data.find(
      ({ currency }) => currency === convertToCurrency.toUpperCase(),
    ).price

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))

    res
      .status(200)
      .set({ 'Content-Type': 'application/json' })
      .send(((value * toRate) / currentRate).toFixed(2))
  } catch (e) {
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.get('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.ts').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(`<!--app-ssr-->`, JSON.stringify(rendered.data) ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
