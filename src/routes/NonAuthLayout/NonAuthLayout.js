import React from 'react'
import { Route, Link } from 'react-router-dom'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import Login from './Login'
import Signup from './Signup'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import './NonAuthLayout.scss'

export default class NonAuthLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const particlesStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
    return <div styleName='background'>
      <div styleName='particlesBackgroundWrapper'>
        <Particles params={particlesjsConfig} style={particlesStyle} />
      </div>
      <div styleName='topRow'>
        <a href='/'>
          <img styleName='logo' src='assets/hylo.svg' />
        </a>
        <Route path='/login' component={() =>
          <Link to='/signup'>
            <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
          </Link>
        } />
      </div>

      <Route path='/login' component={() =>
        <Login {...this.props} styleName='form' />
      } />

      <Route path='/signup' component={() =>
        <Signup {...this.props} styleName='form' />
      } />

      <Route path='/reset-password' component={() =>
        <PasswordReset />
      } />

      <div>
        <p styleName='below-container'>
          <Route path='/signup' component={() =>
            <Link to='/login'>
              Already have an account? <span styleName='green-text'>Sign in</span>
            </Link>
          } />
        </p>
      </div>
    </div>
  }
}
