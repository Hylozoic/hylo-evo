import React, { Component } from 'react'
import Button from 'components/Button'
import LeftSidebar from '../LeftSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default class AddLocation extends Component {
  constructor () {
    super()
    this.state = {
      location: ''
    }
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
    this.props.goToNextStep()
  }

  render () {
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
                this.props.goToNextStep()
              }
            }}
            autoFocus
            placeholder={'Where do you call home?'}
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Button styleName='continue-button' label='Continue' onClick={this.submit} />
            </div>
            <div styleName='instruction'>or press Enter</div>
          </div>
        </div>
      </div>
    </div>
  }
}
