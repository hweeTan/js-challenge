import { createContext } from 'react'

import type { CurrencyList } from '../types'

export const initialValue = {
  data: [] as CurrencyList,
  left: {
    currency: 'USD',
    value: 0,
  },
  right: {
    currency: 'USD',
    value: 0,
  },
  onChange: (name: string, currency: string, value: number) => {},
}

export const AppContext = createContext(initialValue)
