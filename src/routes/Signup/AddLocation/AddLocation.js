import React, { Component } from 'react'
import Button from 'components/Button'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import LeftSidebar from '../LeftSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      fireRedirect: false
    }
    this.redirectUrl = '/signup/upload-photo'
  }
  handleLocationChange = (event) => {
    const location = event.target.value
    this.setState({
      location
    })
  }
  submit = () => {
    const location = this.state.location
    this.props.updateUserSettings({location})
  }

  redirect = () => {
    this.setState({
      fireRedirect: true
    })
  }

  render () {
    const { fireRedirect } = this.state
    const logoUrl = hyloNameWhiteBackground
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Add your location'
        body='Add your location to see more relevant content, and find people and projects around you.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(logoUrl)} />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='signup-input'
            onChange={this.handleLocationChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
                this.redirect()
              }
            }}
            autoFocus
            placeholder={'Where do you call home?'}
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Link to={'/signup/create-community'} onClick={this.submit}>
                <Button styleName='continue-button' label='Continue' />
              </Link>
            </div>
            <div styleName='instruction'>or press Enter</div>
          </div>
        </div>
      </div>
      { fireRedirect && <Redirect to={this.redirectUrl} /> }
    </div>
  }
}
