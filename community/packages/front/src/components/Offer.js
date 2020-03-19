import React, { Component } from 'react'
import {geocode, revgeocode, getMyLocation} from '../Geoservice'
import sendReq from '../XHR'
import {communityService, offers} from '../configs.json'
import {access_token} from '../credentials.json'

class Offer extends Component {
  initialState = {
    identity: 'offers', 
    name: '',
    telefon: '',
    address: '',
    coordinate: {},
    radius: 200,          // TODO: 
    timeframe: '',          // TODO
    services: {},
    notes: '',
    input: 'none'
  }

  state = this.initialState

  autoAddress;

  animateLoading = () => {
    const loading = 'Loading';
    const dots = '......';
    const length = (this.state.address.length - 6)%4;

    this.setState({
      address: loading + dots.slice(0, length)
    })
  }

  animation = null;

  hide = () => {
    this.setState({
      input: 'none'
    })
  }

  show = async () => {
    if(this.state.input == 'block') {
      this.hide();
      return;
    }

    if(this.props.hideRequest){
      this.props.hideRequest()
    }
    this.props.setHideOffer(this.hide);

    this.setState({
      input: 'block',
      address: 'Loading'
    })

    this.animation = window.setInterval(this.animateLoading, 300)

    let pos = await getMyLocation();
    console.log(pos)
    this.setState({
      coordinate: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }
    })

    let res = (await revgeocode(pos.coords)).Response.View[0].Result;
    
    for(let i = 0; i<res.length; i++) {
      if(res[i].MatchLevel == 'houseNumber'){
        res = res[i];
        break;
      }
    }
    
    this.autoAddress = res.Location.Address.Label;

    clearInterval(this.animation);
  
    this.setState({
      address: this.autoAddress
    })
  }

  handleMultiChange = event => {
    const { name, value, checked } = event.target
    let services = this.state.services;
    services[name] = checked;

    this.setState({
      services: services,
    })
  }

  handleChange = event => {
    const { name, value } = event.target
  
    if(name == 'address') {
      clearInterval(this.animation);
    }

    this.setState({
      [name]: value,
    })
  }

  makeOffer = async () => {
    if(this.autoAddress != this.state.address) {
      let res = await geocode(this.state.address);
      let coord = res.Response.View[0].Result[0].Location.DisplayPosition
      
      this.setState({
        coordinate: {
          longitude: coord.Longitude,
          latitude: coord.Latitude
        }
      })
    }

    this.state.start = Date.now()
    this.state.stop = (new Date('12/31/2020')).getTime()

    this.state.email = this.props.email;
    delete this.state.input;

    await this.createFeature(this.state);

    sendReq('POST', communityService, this.state, {})
    console.log(this.state)

  }

  createFeature = async (props) => {

    let feature = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [props.coordinate.longitude, props.coordinate.latitude,0]
          },
          "properties": props
        }
      ]
    };

    this.props.display.getLayers(2).addFeature(feature.features[0]);

    await sendReq(
      'PUT', 
      'https://xyz.api.here.com/hub/spaces/' + offers + '/features', 
      feature, 
      {
        'accept': 'application/geo+json',
        'content-type': 'application/geo+json',
        'authorization': 'Bearer ' + access_token
      });
            
  }

  render() {
    const { name, input, telefon, address, radius, services, notes } = this.state
    const { email } = this.props
    
    return (
      <div className="offerContainer" >
        <input type="button" value="Make offer" className="button offerButton" onClick={this.show} />
        <div className="dialog offerDialog" style={{ display: input }}>
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
              onChange={this.handleChange} />

            <label htmlFor="telefon">Telefon:</label>
            <input
              type="text"
              name="telefon"
              id="telefon"
              value={telefon}
              onChange={this.handleChange} />

            <label htmlFor="address">My Address:</label>
            <input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={this.handleChange} />

            <label htmlFor="radius">Radius:</label>
            <input
              type="text"
              name="radius"
              id="radius"
              value={radius}
              onChange={this.handleChange} />


            <label htmlFor="services">My offers:</label>
            <div className="services" onChange={this.handleMultiChange} method="get">
              <input type="checkbox" name="grocery" value="grocery" />
              <label htmlFor="grocery"> Grocery</label><br/>
              <input type="checkbox" name="restaurant" value="restaurant" />
              <label htmlFor="restaurant"> Restaurant</label><br/>
              <input type="checkbox" name="medicine" value="medicine" />
              <label htmlFor="medicine"> Medicine</label><br/>
              <input type="checkbox" name="walkdog" value="walkdog" />
              <label htmlFor="walkdog"> Walk Dog</label><br/>
            </div>

            <label htmlFor="notes">Notes:</label>
            <textarea
              type="text"
              rows="2" 
              name="notes"
              id="notes"
              value={notes}
              onChange={this.handleChange} />

            <input type="button" value="Make Offer" className="button offerSubmit" onClick={this.makeOffer} />
          </form>
        </div>
      </div>
    )
  }
}

export default Offer