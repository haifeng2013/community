import React, { Component } from 'react'
import {geocode, revgeocode, getMyLocation} from '../Geoservice'
import sendReq from '../XHR'
import {communityService, offers} from '../configs.json'
import {access_token} from '../credentials.json'

class Contact extends Component {
  initialState = {
    name: '',
    telefon: '',
    address: '',
    coordinate: {},
    radius: 1000,          // TODO: 
    timeframe: '',          // TODO
    services: {},
    notes: '',
    message: '',
    input: 'none'
  }

  state = this.initialState

  show = (prop)=>{
    prop.input = 'block';
    this.setState(prop)

    console.log(prop)
  }

  hide = ()=> {
    this.setState({
      input: 'none'
    })
  }

  makecontact = ()=>{

  }

  handleChange = ()=>{

  }

  componentDidMount() {
    this.props.setHideContact(this.hide)
    this.props.setShowContact(this.show)
  }

  render() {
    const { input, name, telefon, address, services, notes, email, message } = this.state

    let service = '';
    for(var i in services){
      if(services[i])
        service += ' '+ i
    }

    return (
      <div className="contactContainer" >
        <div className="dialog contactDialog" style={{ display: input }}>
          <form>
            <label htmlFor="email">Email:</label>
            <input
              // autoComplete="off"
              type="text"
              name="email"
              id="email"
              value={email}
              disabled="disabled"
              onChange={this.handleChange} />

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              disabled="disabled"
              onChange={this.handleChange} />

            <label htmlFor="telefon">Telefon:</label>
            <input
              type="text"
              name="telefon"
              id="telefon"
              value={telefon}
              disabled="disabled"
              onChange={this.handleChange} />

            <label htmlFor="address">My Address:</label>
            <input
              type="text"
              name="address"
              id="address"
              value={address}
              disabled="disabled"
              onChange={this.handleChange} />

            <label htmlFor="service">Services:</label>
            <input
              type="text"
              name="service"
              id="service"
              value={service}
              disabled="disabled"
              onChange={this.handleChange} />

            <label htmlFor="notes">Notes:</label>
            <textarea
              type="text"
              rows="2" 
              name="notes"
              id="notes"
              value={notes}
              disabled="disabled"
              onChange={this.handleChange} />

              <label htmlFor="message">My Message:</label>
              <textarea
                type="text"
                rows="2" 
                name="message"
                id="message"
                value={message}
                onChange={this.handleChange} />

            <input type="button" value="Contact" className="button contactSubmit" onClick={this.makecontact} />
          </form>
        </div>
      </div>
    )
  }
}

export default Contact