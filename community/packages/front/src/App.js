import React, { Component } from 'react'
import Map from './components/Map'
import Login from './components/Login'
import Request from './components/Request'
import Offer from './components/Offer'
import Contact from './components/Contact'

class App extends Component {
  state = {
    email:'',
    display: null,
    addCommunityLayer: null,
    hideRequest: null,
    hideOffer: null,
    showContact: null,
    hideContact: null,
    selected: null
  }

  setMap = (display, addCommunityLayer) => {
    this.setState({display, addCommunityLayer})
  }

  setSelected = (selected) => {
    this.setState({selected})
  }

  setEmail = email => {
    this.setState({email})
  }

  setHideRequest = hideRequest => {
    this.setState({hideRequest})
  }

  setHideOffer = hideOffer => {
    this.setState({hideOffer})
  }

  setShowContact = showContact => {
    this.setState({showContact})
  }

  setHideContact = hideContact => {
    this.setState({hideContact})
  }

  render() {
    const { email, display, addCommunityLayer, hideRequest, hideOffer, hideContact, showContact, selected } = this.state
    
    return (
      <div className="container">
        <Map setMap={this.setMap} setSelected={this.setSelected}  hideContact={hideContact} showContact={showContact} />
        <Contact selected={selected} setShowContact={this.setShowContact} setHideContact={this.setHideContact} />
        <Request email={email} setHideRequest={this.setHideRequest} hideOffer={hideOffer} display={display} />
        <Offer email={email} setHideOffer={this.setHideOffer} hideRequest={hideRequest} display={display} />
        <Login display={display} addCommunityLayer={addCommunityLayer} setEmail={this.setEmail} />
      </div>
    )
  }
}

export default App