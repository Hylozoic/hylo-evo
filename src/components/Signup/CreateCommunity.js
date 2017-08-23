import React, { Component } from 'react'

import { Pill } from 'components/Pillbox/Pillbox'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import './Signup.scss'

export default class CreateCommunity extends Component {
  handleCommunityNameChange = (event) => {
    const communityName = event.target.value
    this.setState({
      communityName
    })
  }

  render () {
    const avatarUrl = hyloNameWhiteBackground
    return <div styleName='wrapper'>
      <div styleName='sidebar'>
        <p styleName='gray-text'>Close</p>
        <p styleName='sidebar-header'>Great, let's get started</p>
        <p styleName='gray-text'>All good things start somewhere! Let's kick things off with a catchy name for your community.</p>
      </div>
      <div styleName='detail'>
        <span styleName='white-text float-right'>STEP 1/4</span>
        <br />
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(avatarUrl)} />
        </div>
        <div styleName='center center-vertical'>
          <input
            styleName='my-input'
            onChange={this.handleCommunityNameChange}
            autoFocus
          />
        </div>
        <div>
          <div styleName='float-right bottom'>
            <div>
              <Pill label='Continue' styleName='my-button' />
            </div>
            <div styleName='or-press-enter'>Or Press Enter</div>
          </div>
        </div>
      </div>
    </div>
  }
}
