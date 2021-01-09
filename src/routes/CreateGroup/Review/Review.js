import React, { Component, createRef } from 'react'
import '../CreateGroup.scss'
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
    const fields = ['groupName', 'groupDomain']
    this.inputRefs = fields.reduce((acc, name) => {
      acc[name] = createRef()
      return acc
    }, {})
    this.state = {
      edits: fields.reduce((acc, name) => {
        acc[name] = null
        return acc
      }, {}),
      readOnly: fields.reduce((acc, name) => {
        acc[name] = true
        return acc
      }, {})
    }
  }

  editHandler = (name) => {
    this.setState({
      readOnly: {
        ...this.state.readOnly,
        [name]: false
      }
    })
    this.inputRefs[name].current.select()
  }

  handleInputChange = (event, name) => {
    let value = event.target.value
    if (name === 'groupDomain') {
      value = removeUrlFromDomain(value)
      if (value !== '') {
        this.props.fetchGroupExists(value)
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
    const { groupName, groupDomain, groupNetworkId } = this.state.edits
    this.props.createGroup(
      // groupPrivacy,
      groupName,
      groupDomain,
      groupNetworkId
    )
      .then(({ error }) => {
        if (error) {
          this.setState({
            error: 'There was an error, please try again.'
          })
        } else {
          this.props.goToGroup(`${groupDomain}`)
        }
      })
  }

  errorCheckAndSubmit = () => {
    const { groupName, groupDomain } = this.state.edits
    if (groupName === '' || groupDomain === '') {
      this.setState({
        error: 'Please fill in each field.'
      })
    } else if (this.props.groupDomainExists) {
      this.setState({
        error: 'This URL already exists. Try another.'
      })
    } else if (!slugValidatorRegex.test(removeUrlFromDomain(groupDomain))) {
      formatDomainWithUrl(groupDomain)
      this.setState({
        error: invalidSlugMessage
      })
    } else {
      this.submit()
    }
  }

  componentWillMount = () => {
    const { groupPrivacy } = this.props
    const privacyOption = find(privacyOptions, { label: groupPrivacy })
    const selectedGroupPrivacy = get('label', privacyOption) // set to Private by default
    this.setState({
      edits: {
        groupName: get('groupName', this.props) || '',
        groupDomain: get('groupDomain', this.props) || '',
        groupNetworkId: get('groupNetworkId', this.props) || '',
        groupPrivacy: selectedGroupPrivacy
      }
    })
  }

  formatDomainWithUrl (groupDomain) {
    if (!groupDomain) return null
    let formattedDomain = groupDomain.replace('hylo.com/g/', '').replace('hylo.com/g', '')
    if (formattedDomain !== '') {
      formattedDomain = 'hylo.com/g/' + formattedDomain
    }
    return formattedDomain
  }

  removeUrlFromDomain (groupDomain) {
    return groupDomain.replace('hylo.com/g/', '')
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
            label={'Group Name'}
            value={this.state.edits.groupName || ''}
            readOnly={this.state.readOnly.groupName}
            editHandler={() => this.editHandler('groupName')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'groupName')}
            inputRef={this.inputRefs['groupName']}
          />
          <ReviewTextInput
            label={'URL'}
            value={formatDomainWithUrl(this.state.edits.groupDomain) || ''}
            readOnly={this.state.readOnly.groupDomain}
            editHandler={() => this.editHandler('groupDomain')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'groupDomain')}
            inputRef={this.inputRefs['groupDomain']}
          />
          {networkName && <ReviewTextInput
            label={'Network'}
            value={networkName}
            readOnly
          />}
          {/* <ReviewTextInput */}
          {/* label={'Privacy'} */}
          {/* value={this.state.edits.groupPrivacy} */}
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
        name='group-name'
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
