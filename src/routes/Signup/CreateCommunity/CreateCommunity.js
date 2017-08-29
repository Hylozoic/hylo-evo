import React, { Component } from 'react'
import Button from 'components/Button'
import { Link } from 'react-router-dom'
import LeftSidebar from '../LeftSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default class CreateCommunity extends Component {
  constructor () {
    super()
    this.state = {
      communityName: ''
    }
  }

  handleCommunityNameChange = (event) => {
    const communityName = event.target.value
    this.setState({
      communityName
    })
  }
  submit = () => {
    const communityName = this.state.communityName
    this.props.createCommunity(communityName)
  }

  render () {
    const logoUrl = hyloNameWhiteBackground
    return <div styleName='wrapper'>
      <LeftSidebar
        header="Great, let's get started"
        body="All good things start somewhere! Let's kick things off with a catchy name for your community."
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
            onChange={this.handleCommunityNameChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.submit()
                this.props.goToNextStep()
              }
            }}
            autoFocus
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Link to={'/signup/add-location'} onClick={this.submit}>
                <Button styleName='continue-button' label='Continue' />
              </Link>
            </div>
            <div styleName='instruction'>or press Enter</div>
          </div>
        </div>
      </div>
    </div>
  }
}
