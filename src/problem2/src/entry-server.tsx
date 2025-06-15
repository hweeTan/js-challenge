import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import type { CurrencyList } from './types'

const COIN_NAME_MAP: Record<string, string> = {
  STEVMOS: 'stEVMOS',
  RATOM: 'rATOM',
  STOSMO: 'stOSMO',
  STATOM: 'stATOM',
  STLUNA: 'stLUNA',
}

const processData = (data: CurrencyList): CurrencyList => {
  const newData: CurrencyList = []

  for (let i = 0; i < data.length; i++) {
    const oldDuplicatedDataIndex = newData.findIndex(
      (item) => item.currency === data[i].currency,
    )
    if (oldDuplicatedDataIndex > -1) {
      newData.splice(oldDuplicatedDataIndex, 1)
    }

    newData.push(data[i])
  }

  return newData.map((item) => ({
    ...item,
    currency: COIN_NAME_MAP[item.currency] || item.currency,
  }))
}

export async function render(_url: string) {
  const response = await fetch('https://interview.switcheo.com/prices.json')
  const data: CurrencyList = await response.json()

  const processedData = processData(data)

  const html = renderToString(
    <StrictMode>
      <App data={processedData} />
    </StrictMode>,
  )
  return { html, data: processedData }
}
