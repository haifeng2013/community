import React, { Component } from 'react'
import sendReq from '../XHR'
import {getMyLocation} from '../Geoservice'
import {access_token} from '../credentials.json'
import {hub} from '../configs.json'

const header = {
  'accept': 'application/json',
  'authorization': 'Bearer '+ access_token
}


class Login extends Component {
  initialState = {
    email: '' ,
    pass: '',
    showing: true
  }

  state = this.initialState
  
  
  handleChange = event => {
    const { name, value } = event.target
    
    this.setState({
      [name]: value,
    })
  }

  login = async pass => {
    console.log(this.state)
    let spaces = await sendReq('GET', hub + '/spaces', {}, header);
// spaces[0] is the space
console.log('login', spaces)
    if(!spaces.error) {
      let position = await getMyLocation();
      this.props.display.setCenter(position.coords);
      this.props.addCommunityLayer();
      this.props.setEmail(this.state.email);

      this.initialState.showing = false;
      this.setState(this.initialState)
    }
  }

  render() {
    const { pass, email, showing } = this.state
    
    return (
      <div className="loginContainer" style={{ display: (showing ? 'block' : 'none') }}>
        <div className="loginCover"></div>
        <div className="dialog loginDialog">
          <form>
            <label htmlFor="email">Email:</label>
            <input
              // autoComplete="off"
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={this.handleChange} />

            <label htmlFor="pass">Password:</label>
            <input
              autoComplete="off"
              type="password"
              name="pass"
              id="pass"
              value={pass}
              onChange={this.handleChange} />

              <input type="button" value="Login" className="button" onClick={this.login} />
          </form>
        </div>
      </div>
    )
  }
}

export default Login