import React, { Component } from 'react'
import Button from 'components/Button'
import LeftSidebar from '../LeftSidebar'
import { isEmpty } from 'lodash'
import '../Signup.scss'

export default class AddSkills extends Component {
  submit = () => {
    // const location = this.state.location
    // this.props.updateUserSettings({location})
    // this.props.goToNextStep()
  }

  handleInputChange = (event) => {
    this.props.setAutocomplete(event.target.value)
  }

  componentDidUpdate (prevProps) {
    if (!isEmpty(this.props.autocomplete) && prevProps.autocomplete !== this.props.autocomplete) {
      this.props.fetchSkills(this.props.autocomplete)
    }
  }
  render () {
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Add your location'
        body='Add your location to see more relevant content, and find people and projects around you.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 1/4</span>
        <br />
        <div styleName='center center-skills'>
          <input
            styleName='signup-input center-text'
            autoFocus
            onChange={this.handleInputChange}
            placeholder={'How can you help?'}
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
