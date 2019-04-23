import React, { Component } from 'react'
import '../CreateCommunity.scss'
import ModalSidebar from 'components/ModalSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground, groovingAxolotl } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import { find } from 'lodash'
import { get } from 'lodash/fp'
import {
  slugValidatorRegex,
  formatDomainWithUrl,
  removeUrlFromDomain,
  invalidSlugMessage
} from '../util'

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
        name: '',
        email: '',
        communityName: '',
        communityDomain: '',
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
    this[name].select()
  }

  handleInputChange = (event, name) => {
    let value = event.target.value
    if (name === 'communityDomain') {
      value = removeUrlFromDomain(value)
      if (value !== '') {
        this.props.fetchCommunityExists(value)
      }
    }
    this.setState({
      edits: {
        ...this.state.edits,
        [name]: value,
        changed: true
      }
    })
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.errorCheckAndSubmit()
    }
  }

  submit = () => {
    const { name, email, communityName, communityDomain, communityNetworkId } = this.state.edits
    this.state.edits.changed && this.props.updateUserSettings({
      name,
      email
    })
    this.props.createCommunity(
      // communityPrivacy,
      communityName,
      communityDomain,
      communityNetworkId
    )
      .then(({ error }) => {
        if (error) {
          this.setState({
            error: 'There was an error, please try again.'
          })
        } else {
          this.props.goToCommunity(`${communityDomain}`)
        }
      })
  }

  errorCheckAndSubmit = () => {
    const { name, email, communityName, communityDomain } = this.state.edits
    if (name === '' || email === '' || communityName === '' || communityDomain === '') {
      this.setState({
        error: 'Please fill in each field.'
      })
    } else if (this.props.communityDomainExists) {
      this.setState({
        error: 'This URL already exists. Try another.'
      })
    } else if (!slugValidatorRegex.test(removeUrlFromDomain(communityDomain))) {
      formatDomainWithUrl(communityDomain)
      this.setState({
        error: invalidSlugMessage
      })
    } else {
      this.submit()
    }
  }

  componentWillMount = () => {
    const { communityPrivacy } = this.props
    const privacyOption = find(privacyOptions, { label: communityPrivacy })
    const selectedCommunityPrivacy = get('label', privacyOption) // set to Private by default
    this.setState({
      edits: {
        name: get('name', this.props.currentUser) || '',
        email: get('email', this.props.currentUser) || '',
        communityName: get('communityName', this.props) || '',
        communityDomain: get('communityDomain', this.props) || '',
        communityNetworkId: get('communityNetworkId', this.props) || '',
        communityPrivacy: selectedCommunityPrivacy
      }
    })
  }

  formatDomainWithUrl (communityDomain) {
    if (!communityDomain) return null
    let formattedDomain = communityDomain.replace('hylo.com/c/', '').replace('hylo.com/c', '')
    if (formattedDomain !== '') {
      formattedDomain = 'hylo.com/c/' + formattedDomain
    }
    return formattedDomain
  }

  removeUrlFromDomain (communityDomain) {
    return communityDomain.replace('hylo.com/c/', '')
  }

  render () {
    const { networkName } = this.props

    return <div styleName='flex-wrapper'>
      <ModalSidebar
        imageUrl={groovingAxolotl}
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header='Everything looking good?'
        body='You can always come back and change your details at any time'
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
            value={this.state.edits.name || ''}
            readOnly={this.state.readOnly.name}
            editHandler={(event) => this.editHandler('name')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'name')}
          />
          <ReviewTextInput
            label={'Your Email'}
            value={this.state.edits.email || ''}
            readOnly={this.state.readOnly.email}
            editHandler={() => this.editHandler('email')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'email')}
          />
          <ReviewTextInput
            label={'Community Name'}
            value={this.state.edits.communityName || ''}
            readOnly={this.state.readOnly.communityName}
            editHandler={() => this.editHandler('communityName')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'communityName')}
          />
          <ReviewTextInput
            label={'URL'}
            value={formatDomainWithUrl(this.state.edits.communityDomain) || ''}
            readOnly={this.state.readOnly.communityDomain}
            editHandler={() => this.editHandler('communityDomain')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'communityDomain')}
          />
          {networkName && <ReviewTextInput
            label={'Network'}
            value={networkName}
            readOnly
          />}
          {/* <ReviewTextInput */}
          {/* label={'Privacy'} */}
          {/* value={this.state.edits.communityPrivacy} */}
          {/* onEnter={this.onEnter} */}
          {/* editHandler={() => this.props.goToPrivacyStep()} */}
          {/* /> */}

        </div>
        { this.state.error && <span styleName='review-arrow-up' /> }
        { this.state.error && <span styleName='review-error'>{this.state.error}</span>}
      </div>
      <ModalFooter
        submit={this.errorCheckAndSubmit}
        previous={this.previous}
        showPrevious={false}
        continueText={'Finish Up'}
      />
    </div>
  }
}

export function ReviewTextInput ({ label, value, editHandler, onChange, readOnly = true, inputRef }) {
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
        noClearButton
        onChange={onChange}
        inputRef={inputRef}
      />
    </div>
    {editHandler && <div styleName='review-input-edit'>
      <span styleName='edit-button' onClick={editHandler}>Edit</span>
    </div>}
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
  { id: '0', label: 'public' },
  { id: '1', label: 'private' },
  { id: '2', label: 'unlisted' }
]
