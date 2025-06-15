const sum_to_n_a = (n) => {
  let result = 0

  for (let i = 1; i <= n; i++) {
    result += i
  }

  return result
}

const sum_to_n_b = (n) => {
  return new Array(n).fill(null).reduce((prev, _, i) => prev + i + 1, 0)
}

const sum_to_n_c = (n) => {
  return (n * (n + 1)) / 2
}
