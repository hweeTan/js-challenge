import './App.css'
import { useState, useContext, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import LoopIcon from '@mui/icons-material/Loop'

import { CurrencyCard } from './components/CurrencyCard'
import { initialValue, AppContext } from './components/AppContext'
import type { CurrencyList } from './types'
import { useGetRate } from './data/use-get-rate'

const AppContent = ({ loading }: { loading: boolean }) => {
  const { data, left, right, onChange } = useContext(AppContext)

  return (
    <main className='Main'>
      <CurrencyCard name='left' data={data} {...left} onChange={onChange} />
      <IconButton
        onClick={() => {
          onChange('left', right.currency, right.value)
          onChange('right', left.currency, left.value)
        }}
      >
        <LoopIcon fontSize='large' color='secondary' />
      </IconButton>
      <CurrencyCard
        name='right'
        data={data}
        {...right}
        onChange={onChange}
        isResult
        loading={loading}
      />
    </main>
  )
}

function App({ data }: { data: CurrencyList }) {
  const [state, setState] = useState(initialValue)
  const { loading, getRate } = useGetRate()

  const handleChange = (name: string, currency: string, value: number) => {
    setState((prev) => ({
      ...prev,
      [name]: {
        currency,
        value,
      },
    }))
  }

  useEffect(() => {
    if (state.left.value <= 0) {
      return
    }

    getRate({
      currency: state.left.currency,
      value: state.left.value,
      convertToCurrency: state.right.currency,
    }).then((data) => {
      setState((prev) => ({
        ...prev,
        right: {
          ...prev.right,
          value: data,
        },
      }))
    })
  }, [state.left, state.right.currency])

  return (
    <AppContext.Provider
      value={{
        ...state,
        data,
        onChange: handleChange,
      }}
    >
      <AppContent loading={loading} />
    </AppContext.Provider>
  )
}

export default App
