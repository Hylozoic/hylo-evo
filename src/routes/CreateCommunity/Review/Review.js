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
        domain: true
      },
      edits: {
        name: '',
        domain: '',
        defaultTopics: [],
        templateName: null,
        privacy: null,
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
    if (name === 'domain') {
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
    const { name, domain, defaultTopics, template, networkId } = this.state.edits
    this.props.createCommunity(
      // privacy,
      name,
      domain,
      template ? template.id : null,
      defaultTopics,
      networkId
    )
      .then(({ error }) => {
        if (error) {
          this.setState({
            error: 'There was an error, please try again.'
          })
        } else {
          this.props.goToCommunity(`${domain}`)
        }
      })
  }

  errorCheckAndSubmit = () => {
    const { name, domain } = this.state.edits
    if (name === '' || domain === '') {
      this.setState({
        error: 'Please fill in each field.'
      })
    } else if (this.props.domainExists) {
      this.setState({
        error: 'This URL already exists. Try another.'
      })
    } else if (!slugValidatorRegex.test(removeUrlFromDomain(domain))) {
      formatDomainWithUrl(domain)
      this.setState({
        error: invalidSlugMessage
      })
    } else {
      this.submit()
    }
  }

  componentWillMount = () => {
    const { privacy } = this.props
    const privacyOption = find(privacyOptions, { label: privacy })
    const selectedprivacy = get('label', privacyOption) // set to Private by default
    this.setState({
      edits: {
        name: get('name', this.props) || '',
        domain: get('domain', this.props) || '',
        defaultTopics: get('defaultTopics', this.props) || [],
        networkId: get('networkId', this.props) || '',
        privacy: selectedprivacy,
        template: get('template', this.props) || null
      }
    })
  }

  formatDomainWithUrl (domain) {
    if (!domain) return null
    let formattedDomain = domain.replace('hylo.com/c/', '').replace('hylo.com/c', '')
    if (formattedDomain !== '') {
      formattedDomain = 'hylo.com/c/' + formattedDomain
    }
    return formattedDomain
  }

  removeUrlFromDomain (domain) {
    return domain.replace('hylo.com/c/', '')
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
          <span styleName='step-count'>STEP 4/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-review'>
          <ReviewTextInput
            label={'Community Name'}
            value={this.state.edits.name || ''}
            readOnly={this.state.readOnly.name}
            editHandler={() => this.editHandler('name')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'name')}
            inputRef={(input) => { this.name = input }}
          />
          <ReviewTextInput
            label={'URL'}
            value={formatDomainWithUrl(this.state.edits.domain) || ''}
            readOnly={this.state.readOnly.domain}
            editHandler={() => this.editHandler('domain')}
            onEnter={this.onEnter}
            onChange={(e) => this.handleInputChange(e, 'domain')}
            inputRef={(input) => { this.domain = input }}
          />
          <ReviewTextInput
            label={'Community Template'}
            value={this.state.edits.template ? this.state.edits.template.displayName : ''}
            readOnly
            editHandler={() => this.props.goToStep('template')}
          />
          <ReviewTextInput
            label={'Default Topics'}
            value={this.state.edits.defaultTopics}
            readOnly
            editHandler={() => this.props.goToStep('template')}
          />
          {networkName && <ReviewTextInput
            label={'Network'}
            value={networkName}
            readOnly
          />}
          {/* <ReviewTextInput */}
          {/* label={'Privacy'} */}
          {/* value={this.state.edits.privacy} */}
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
      { Array.isArray(value)
        ? <div styleName='reviewPills'>{value.map((v, index) => <Pill key={index} value={v} />)}</div>
        : <TextInput
          type='text'
          value={value}
          theme={inputTheme}
          readOnly={readOnly}
          noClearButton
          onChange={onChange}
          inputRef={inputRef}
        />
      }
    </div>
    {editHandler && <div styleName='review-input-edit'>
      <span styleName='edit-button' onClick={editHandler}>Edit</span>
    </div>}
  </div>
}

function Pill ({ value }) {
  return <span styleName='defaultTopic'>
    {value}
  </span>
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
