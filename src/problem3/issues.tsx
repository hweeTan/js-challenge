// Unnecessary type, should be included in useWalletBalances
interface WalletBalance {
  currency: string;
  amount: number;
}
// Unnecessary type, could be automatically inferred after mapping
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ERROR: What is BoxProps? Do you mean HTMLAttributes?
interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Should avoid "any" type. We can use "string" here
  // The function should be extracted and tested
	const getPriority = (blockchain: any): number => {
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

  const sortedBalances = useMemo(() => {
    // This whole filter and sort should be extracted and tested
    return balances.filter((balance: WalletBalance) => {
      // ERR: Property 'blockchain' does not exist on type 'WalletBalance'. You mean "balance.currency"?
		  const balancePriority = getPriority(balance.blockchain);
      // ERR: lhsPriority does not exist, you mean "balancePriority"?
      // This filter can be further simplified.
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // ERR: Property 'blockchain' does not exist on type 'WalletBalance'. You mean "balance.currency"?
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
      // Nit: this sort logic can also be simplified a bit
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  // This should be included in the useMemo above
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // This usd value can be done within the "map" above where formatted is done
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        // ERROR: where does this "classes" come from?
        className={classes.row}
        // "balance.currency" seems to be a better candidate for the key prop
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
