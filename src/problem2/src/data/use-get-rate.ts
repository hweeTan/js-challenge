import { useState } from 'react'

type Props = {
  currency: string
  value: number
  convertToCurrency: string
}

export const useGetRate = () => {
  const [loading, setLoading] = useState(false)

  const getRate = ({ currency, value, convertToCurrency }: Props) => {
    setLoading(true)

    return fetch('/get-rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency,
        value,
        convertToCurrency,
      }),
    })
      .then((response) => response.json())
      .finally(() => setLoading(false))
  }

  return {
    loading,
    getRate,
  }
}
