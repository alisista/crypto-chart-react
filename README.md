## Cryptocurrency Price Chart as a React Component

[![npm package](https://nodei.co/npm/crypto-chart-react.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/crypto-chart-react/)

![example chart](https://raw.githubusercontent.com/alisista/crypto-chart-react/master/assets/example.png "example chart")

---


## Table of contents

- [Installation](#installation)
- [Demo](#demo)
- [Examples](#examples)
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

## Examples

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
		borderColor="#61669F"
        />
    )
  }
}

render(<App />, document.getElementById("root"))

```


```js
import React, { Component } from 'react'
import { render } from 'react-dom'
import CHART from '../../src'

class App extends Component {
  constructor(props){
    super(props)
  }
  render(){
    // custom span
    return (
      <CHART
        id="crypto_chart"
        height={300}
        width={700}
        fsym="ALIS"
        tsym="JPY"
		timezone="Asia/Tokyo"
		limit={24*6}
		style={{margin: "25px"}}
		wrapper_id="crypto_chart_wrapper"
		toTs={{Math.floor(Date.now() / 1000)}}
		borderColor="#61669F"
        />
    )
  }
}

render(<App />, document.getElementById("root"))
```

---

## Contributors

- [OK Rabbit (@ocrybit)](https://github.com/ocrybit)


