import React, { Component } from 'react'
import '../CreateCommunity.scss'
import ModalSidebar from 'components/ModalSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import { find } from 'lodash'
import { get } from 'lodash/fp'

export default class Review extends Component {
  constructor () {
    super()
    this.state = {
      readOnly: {
        name: true,
        email: true,
        communityName: true,
        communityDomain: true
      },
      edits: {
        name: null,
        email: null,
        communityName: null,
        communityDomain: null,
        communityPrivacy: null,
        changed: false
      }
    }
  }

  editHandler = (name) => {
    this.setState({
      readOnly: {
        ...this.state.readOnly,
        [name]: false
      }
    })
  }

  handleInputChange = (event, name) => {
    const value = event.target.value
    this.setState({
      edits: {
        ...this.state.edits,
        [name]: value,
        changed: true
      }
    })
  }

  submit = () => {
    const { name, email, communityName, communityDomain, communityPrivacy } = this.state.edits
    this.state.edits.changed && this.props.updateUserSettings({
      name,
      email
    })
    this.props.createCommunity(
      // communityPrivacy,
      communityName,
      communityDomain
    )
    this.props.clearNameFromCreateCommunity()
    this.props.clearDomainFromCreateCommunity()
    this.props.goToNextStep()
  }

  componentWillMount = () => {
    const { communityPrivacy } = this.props
    const privacyOption = find(privacyOptions, {label: communityPrivacy})
    const selectedCommunityPrivacy = get('label', privacyOption) // set to Private by default
    this.setState({
      edits: {
        name: get('name', this.props.currentUser),
        email: get('email', this.props.currentUser),
        communityName: get('communityName', this.props),
        communityDomain: get('communityDomain', this.props),
        communityPrivacy: selectedCommunityPrivacy
      }
    })
  }

  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header="Great, let's get started"
        body="All good things start somewhere! Let's kick things off with a catchy name for your community."
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 3/3</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-review'>
          <ReviewTextInput
            label={'Your Name'}
            value={this.state.edits.name}
            readOnly={this.state.readOnly.name}
            editHandler={() => this.editHandler('name')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'name')}
          />
          <ReviewTextInput
            label={'Your Email'}
            value={this.state.edits.email}
            readOnly={this.state.readOnly.email}
            editHandler={() => this.editHandler('email')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'email')}
          />
          <ReviewTextInput
            label={'Community Name'}
            value={this.state.edits.communityName}
            readOnly={this.state.readOnly.communityName}
            editHandler={() => this.editHandler('communityName')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'communityName')}
          />
          <ReviewTextInput
            label={'Domain'}
            value={this.state.edits.communityDomain}
            readOnly={this.state.readOnly.communityDomain}
            editHandler={() => this.editHandler('communityDomain')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'communityDomain')}
          />
          {/*}<ReviewTextInput
            label={'Privacy'}
            value={this.state.edits.communityPrivacy}
            onEnter={this.onEnter}
            editHandler={() => this.props.goToPrivacyStep()}
          />*/}
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
        previous={this.previous}
        showPrevious={false}
        continueText={'Finish Up'}
        />
    </div>
  }
}

export function ReviewTextInput ({label, value, editHandler, onChange, readOnly = true}) {
  return <div styleName='review-input-text-row'>
    <div styleName='review-input-text-label'>
      <span>{label}</span>
    </div>
    <div styleName='review-input-text'>
      <TextInput
        type='text'
        name='community-name'
        value={value}
        theme={inputTheme}
        readOnly={readOnly}
        showClearButton={false}
        onChange={onChange}
      />
    </div>
    <div styleName='review-input-edit'>
      <span styleName='edit-button' onClick={editHandler}>Edit</span>
    </div>
  </div>
}

const inputTheme = {
  inputStyle: 'modal-input partial',
  wrapperStyle: 'center'
}

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}

const privacyOptions = [
  {id: '0', label: 'public'},
  {id: '1', label: 'private'},
  {id: '2', label: 'unlisted'}
]
