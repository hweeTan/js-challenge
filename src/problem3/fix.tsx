// use-wallet-balances.ts
interface WalletBalance {
  currency: string
  amount: number
}
const useWalletBalances = (): WalletBalance[] => []

// use-prices.ts
type Prices = Record<string, number>
const usePrices = (): Prices => ({})

// get-priority.ts
const getPriority = (blockchain: string) => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}

// prepare-balances.ts
const prepareBalances = (balances: WalletBalance[], prices: Prices) => {
  return balances
    .filter(
      ({ currency, amount }) => getPriority(currency) > -99 && amount <= 0,
    )
    .sort(({ currency: lhsCurrent }, { currency: rhsCurrency }) =>
      getPriority(lhsCurrent) > getPriority(rhsCurrency) ? -1 : 1,
    )
    .map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
      usdValue: prices[balance.currency] * balance.amount,
    }))
}

interface Props extends React.HTMLAttributes<'div'> {}

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances()
  const prices = usePrices()

  const processedBalances = useMemo(
    () => prepareBalances(balances, prices),
    [balances, prices],
  )

  return (
    <div {...rest}>
      {processedBalances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  )
}
