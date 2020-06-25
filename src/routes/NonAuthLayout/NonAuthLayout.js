import React from 'react'
import { Route, Link } from 'react-router-dom'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import Login from './Login'
import Signup from './Signup'
import HolochainLogin from './HolochainLogin'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'
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
          <img styleName='logo' src='assets/hylo.svg' alt='Hylo logo' />
        </a>
        {!HOLOCHAIN_ACTIVE && <Route path='/login' component={() =>
          <Link tabIndex={-1} to='/signup'>
            <Button styleName='signupButton' color='green-white-green-border'>Sign Up</Button>
          </Link>
        } />}
        <Route path='/reset-password' component={() =>
          <Link to='/login'>
            <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
          </Link>
        } />
      </div>

      {HOLOCHAIN_ACTIVE && <Route path='/login' component={() =>
        <HolochainLogin {...this.props} styleName='form' />
      } />}

      {!HOLOCHAIN_ACTIVE && <Route path='/login' component={() =>
        <div styleName='signupRow'>
          <Login {...this.props} styleName='form' />
        </div>
      } />}
      <div styleName='signupRow'>
        <Route path='/signup' component={() =>
          <Signup {...this.props} styleName='form' />
        } />
      </div>

      <Route path='/reset-password' component={() =>
        <PasswordReset {...this.props} styleName='form' />
      } />

      <div styleName='signupToggle'>
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
