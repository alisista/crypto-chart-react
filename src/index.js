import React, { Component } from "react"
import chartjs from "chart.js"
import "whatwg-fetch"
import moment from "moment-timezone"
moment.locale('ja')

class Chart extends Component {
  constructor(props){
    super(props)
    this.state = {
      width: props.width,
      height: props.height,
      fsym: props.fsym || `ALIS`,
      tsym: props.tsym || `JPY`,
      span: props.span || `day`
    }
    this.init = false
    console.log(this.state);
  }
  componentDidMount(){
    this.getData()
  }
  componentWillReceiveProps(props){
    let state = {}
    let changed = false
    let resized = false
    for(let v of [`fsym`, `tsym`, `span`]){
      if(this.props[v] !== props[v]){
	state[v] = props[v]
	changed = true
      }
    }
    for(let v of [`width`, `height`]){
      if(this.props[v] !== props[v]){
	state[v] = props[v]
	resized = true
      }
    }
    if(changed || resized){
      this.setState(state, ()=>{
	if(this.init){
	  if(changed){
	    this.getData()
	  }else{
	    this.draw()
	  }
	}
      })
    }
  } 
  getData(){
    const fsym = this.state.fsym
    const tsym = this.state.tsym
    const span = this.state.span
    const spans = {
      day: {limit: 288, aggregate: 5, unit: `minute`},
      week: {limit: 168, aggregate: 1, unit: `hour`},
      month: {limit: 240, aggregate: 6, unit: `hour`},
      "3month": {limit: 180, aggregate: 12, unit: `hour`},
      year: {limit: 365, aggregate: 1, unit: `day`},
      all: {limit: 400, aggregate: 7, unit: `day`}
    }
    const conf = spans[span]
    let url = `https://min-api.cryptocompare.com/data/histo${conf.unit}?fsym=${fsym}&tsym=${tsym}&limit=${conf.limit}&aggregate=${conf.aggregate}`
    fetch(url).then(res => res.json())
      .then((json)=>{
	if(json.Type != undefined && json.Type !== 1){
	  this.setState({data: json, span: span},()=>{
	    this.draw()
	  })
	}else{
	  this.setState({noData:true})
	}
      })
      .catch((e)=>{
	this.setState({noData:true})
      })
  }
  draw(){
    const span = this.state.span
    const data = this.state.data
    const id = this.props.id || 'crypto-chart'
    var ctx = document.getElementById(this.props.id)
    let dd = []
    let lbs = []
    for(let v of data.Data){
      dd.push(v.close)
      lbs.push(v.time * 1000)
    }
    
    try{this.myChart.destroy()}catch(e){}
    
    let tunit = `hour`
    if([`month`, `week`].includes(span)){
      tunit = `day`
    }else if([`year`, `3month`].includes(span)){
      tunit = `month`
    }else if(span === `all`){
      tunit = `year`
    }
    this.myChart = new chartjs(ctx, {
      type: `line`,
      data: {
	labels: lbs,
	datasets: [
	  { 
            data: dd,
            borderColor: `#3e95cd`
	  }
	]
      },
      options: {
	elements:{
	  point:{radius:0}
	},
	legend:{
	  display: false,
	},
	title: {
	  display: false,
	},
	scales: {
          xAxes: [{
	    type:`time`,
	    time:{
	      unit:tunit,
	      displayFormats:{
		hour: `H時`,
		day: `D日`,
		month:`M月`
	      }
	    }
          }]
        }	
      }
    })
    this.init = true
  }
  render(){
    const id = this.props.id || 'crypto-chart'
    let canvas
    if(this.state.noData){
      canvas = (<div style={{height:`100%`, width:`100%`}}><div style={{marginTop:(this.state.height * 0.4)}}>${this.state.fsym}のデータはありません。</div></div>)
    }else{
      canvas = (<canvas id={id} width={this.state.width} height={this.state.height}></canvas>)
    }
    return (
      <div id={`${id}-wrap`} style={{display: 'inline-block',width: this.state.width,height: this.state.height}}>
	{canvas}
      </div>
    )
  }
}

export default Chart
