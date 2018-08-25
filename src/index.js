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
      span: props.span,
      unit: props.unit,
      toTs: props.toTs,
      aggregate: props.aggregate,
      borderColor: props.borderColor,
      limit: props.limit,
      timezone: props.timezone,
      date: props.date
    }
    this.init = false
  }
  componentDidMount(){
    this.getData()
  }
  componentWillReceiveProps(props){
    let state = {}
    let changed = false
    let resized = false
    for(let v of [`fsym`, `tsym`, `span`, `unit`, `toTs`, `aggregate`, `limit`, `timezone`]){
      if(this.props[v] !== props[v]){
	state[v] = props[v]
	changed = true
      }
    }
    for(let v of [`width`, `height`, `borderColor`]){
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
    let conf, url
    if(span != undefined){
      conf = spans[span]
      url = `https://min-api.cryptocompare.com/data/histo${conf.unit}?fsym=${fsym}&tsym=${tsym}&limit=${conf.limit}&aggregate=${conf.aggregate}`
    }else{
      conf = {
	unit: this.state.unit || `minute`,
	toTs:this.state.toTs || Math.floor(Date.now() / 1000),
	aggregate: this.state.aggregate || 10,
	limit: this.state.limit || (24 * 6)
      }
      url = `https://min-api.cryptocompare.com/data/histo${conf.unit}?fsym=${fsym}&tsym=${tsym}&limit=${conf.limit}&aggregate=${conf.aggregate}&toTs=${conf.toTs}`
    }
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
    let offset = 0
    if(this.state.timezone != undefined){
      offset = new Date().getTimezoneOffset() - moment.tz.zone(this.state.timezone).parse(Date.UTC())
    }
    var ctx = document.getElementById(id)
    let dd = []
    let lbs = []
    for(let v of data.Data){
      dd.push(v.close)
      lbs.push((v.time * 1000) + (offset * 60 * 1000))
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
            borderColor: this.state.borderColor || `#3e95cd`
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
    let wrapper_id = this.props.wrapper_id || `${id}-wrapper`
    let style = {}
    for(let k in this.props.style || {}){
      style[k] = this.props.style[k]
    }
    style.overflow = `hidden`
    style.display = `inline-block`
    style.width = this.state.width
    style.height = this.state.height
    return (
      <div id={wrapper_id} style={style}>
	{canvas}
      </div>
    )
  }
}

export default Chart
