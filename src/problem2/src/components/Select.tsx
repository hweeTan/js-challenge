import { ComponentProps } from 'react'
import { default as MUISelect } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { CurrencyList } from '../types'
import './Select.style.css'

type Props = { data: CurrencyList } & ComponentProps<typeof MUISelect<string>>

export const Select = ({ data, ...props }: Props) => {
  return (
    <MUISelect
      {...props}
      color='secondary'
      size='small'
      variant='outlined'
      className='Select'
      fullWidth
    >
      {data.map(({ currency }) => (
        <MenuItem
          key={currency}
          value={currency}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <img
            width={24}
            height={24}
            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`}
          />
          {currency}
        </MenuItem>
      ))}
    </MUISelect>
  )
}
