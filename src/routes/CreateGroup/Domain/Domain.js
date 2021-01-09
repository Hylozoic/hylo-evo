import React, { Component } from 'react'
import '../CreateGroup.scss'
import ModalSidebar from 'components/ModalSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground, confusedAxolotl, happyAxolotl } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import {
  slugValidatorRegex,
  formatDomainWithUrl,
  removeUrlFromDomain,
  invalidSlugMessage
} from '../util'

export default class Domain extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupDomain: ''
    }
  }

  handleDomainChange = (event) => {
    const groupDomain = removeUrlFromDomain(event.target.value)
    if (groupDomain !== '') {
      if (!slugValidatorRegex.test(groupDomain)) {
        this.setState({ groupDomainInvalid: true })
      } else {
        this.setState({ groupDomainInvalid: false })
        this.props.fetchGroupExists(groupDomain)
      }
    }
    this.setState({ groupDomain })
  }

  submit = () => {
    this.props.addGroupDomain(this.state.groupDomain)
    this.props.goToNextStep()
  }

  errorCheckAndSubmit = () => {
    if (this.props.groupDomainExists) {
      this.setState({
        error: 'This URL already exists. Try another.'
      })
    } else if (this.state.groupDomain === '') {
      this.setState({
        error: 'Please add a URL.'
      })
    } else if (this.state.groupDomainInvalid) {
      this.setState({
        error: invalidSlugMessage
      })
    } else {
      this.submit()
    }
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.errorCheckAndSubmit()
    }
  }

  imageChooser = () => {
    if (this.state.groupDomain !== '') {
      return happyAxolotl
    }
    return confusedAxolotl
  }

  componentWillMount = () => {
    const { groupDomain } = this.props
    if (groupDomain) this.setState({ groupDomain: groupDomain })
  }
  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
        imageUrl={this.imageChooser()}
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header='Choose an address for your group'
        body='Your URL is the address that people will use to access your group online.'
        secondParagraph='The shorter the better!'
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 2/3</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <span styleName='text-input-label'>{ this.state.groupDomain && 'Choose a URL'}</span>
          <TextInput
            type='text'
            name='group-name'
            value={formatDomainWithUrl(this.state.groupDomain)}
            onChange={this.handleDomainChange}
            theme={inputTheme}
            placeholder='Choose a URL'
            noClearButton
            onEnter={this.onEnter}
          />
          { this.state.error && <span styleName='arrow-up' /> }
          { this.state.error && <span styleName='error'>{this.state.error}</span>}
        </div>
      </div>
      <ModalFooter
        submit={this.errorCheckAndSubmit}
        previous={this.props.goToPreviousStep}
        hidePrevious={false}
        continueText={'Continue'}
      />
    </div>
  }
}

const inputTheme = {
  inputStyle: 'modal-input',
  wrapperStyle: 'center'
}

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}
