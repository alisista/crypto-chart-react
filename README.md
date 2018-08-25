## Cryptocurrency Price Chart as a React Component

[![npm package](https://nodei.co/npm/crypto-chart-react.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/crypto-chart-react/)

![example chart](https://raw.githubusercontent.com/alisista/crypto-chart-react/master/assets/example.png "example chart")

---


## Table of contents

- [Installation](#installation)
- [Demo](#demo)
- [Example](#example)
- [Contributors](#contributors)


---


## Installation

```js
yarn add crypto-chart-react
```
---

## Demo

[https://alis.ocrybit.com/coins/?sym=BTC](https://alis.ocrybit.com/coins/?sym=BTC)

---

## Example

```js
import React, { Component } from 'react'
import { render } from 'react-dom'
import CHART from '../../src'

class App extends Component {
  constructor(props){
    super(props)
  }
  render(){
    // possible spans: day, week, month, 3month, year, all
    return (
      <CHART
        id="crypto_chart"
        height={300}
        width={700}
        fsym="ALIS"
        tsym="JPY"
        span="day"
        />
    )
  }
}

render(<App />, document.getElementById("root"))
```

---

## Contributors

- [OK Rabbit (@ocrybit)](https://github.com/ocrybit)


