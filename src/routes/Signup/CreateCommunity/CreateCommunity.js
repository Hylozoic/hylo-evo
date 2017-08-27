import React, { Component } from 'react'
import Button from 'components/Button'
import { Link } from 'react-router-dom'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default class CreateCommunity extends Component {
  handleCommunityNameChange = (event) => {
    const communityName = event.target.value
    this.setState({
      communityName
    })
  }
  submit = (communityName) => {
    this.props.createCommunity(communityName)
  }

  render () {
    const avatarUrl = hyloNameWhiteBackground
    return <div styleName='wrapper'>
      <div styleName='sidebar'>
        <p styleName='gray-text close-button'>CLOSE</p>
        <p styleName='sidebar-header'>Great, let's get started</p>
        <p styleName='gray-text'>All good things start somewhere! Let's kick things off with a catchy name for your community.</p>
      </div>
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(avatarUrl)} />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='create-community-input'
            onChange={this.handleCommunityNameChange}
            autoFocus
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Link to={'/signup/create-community'}>
                <Button styleName='continue-button' label='Onwards!' />
              </Link>
            </div>
            <div styleName='instruction'>or press Enter</div>
          </div>
        </div>
      </div>
    </div>
  }
}
