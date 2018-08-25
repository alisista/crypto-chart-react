import React, { Component } from 'react'
import { render } from 'react-dom'
import CHART from '../../src'

class App extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <CHART
	height={300}
	width={700}
	id="chart"
	fsym="ALIS"
	tsym="JPY"
	span="day"
	/>
    )
  }
}

render(<App />, document.getElementById("root"))

