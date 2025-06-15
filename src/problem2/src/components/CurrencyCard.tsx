import OutlinedInput from '@mui/material/OutlinedInput'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { Select } from './Select'
import type { CurrencyList } from '../types'

type CurrencyCardProps = {
  name: string
  data: CurrencyList
  onChange: (name: string, currency: string, value: number) => void
  currency: string
  value: number
  isResult?: boolean
  loading?: boolean
}

export const CurrencyCard = ({
  name,
  data,
  onChange,
  currency,
  value,
  isResult = false,
  loading = false,
}: CurrencyCardProps) => {
  return (
    <Card sx={{ width: 200 }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <Select
          value={currency}
          onChange={(e) => onChange(name, e.target.value, value)}
          data={data}
        />
        {isResult ? (
          loading ? (
            <Skeleton width={168} height={32} />
          ) : (
            <Typography variant='h5'>{value}</Typography>
          )
        ) : (
          <OutlinedInput
            name={`value[${name}]`}
            value={value}
            onChange={(e) => onChange(name, currency, Number(e.target.value))}
            type='number'
            size='small'
            color='primary'
          />
        )}
      </CardContent>
    </Card>
  )
}
