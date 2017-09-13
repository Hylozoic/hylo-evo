import React, { Component } from 'react'
import '../CreateCommunity.scss'
import ModalSidebar from 'components/ModalSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground, confusedAxolotl, happyAxolotl } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import { slugValidatorRegex } from '../util'

export default class Domain extends Component {
  constructor (props) {
    super(props)
    this.state = {
      communityDomain: ''
    }
  }

  handleDomainChange = (event) => {
    const communityDomain = event.target.value
    this.props.fetchCommunityExists(this.removeUrlFromDomain(communityDomain))
    this.setState({
      communityDomain: this.formatDomainWithUrl(communityDomain)
    })
  }

  submit = () => {
    const communityDomain = this.removeUrlFromDomain(this.state.communityDomain)
    this.props.addCommunityDomain(communityDomain)
    this.props.goToNextStep()
  }

  errorCheckAndSubmit = () => {
    if (this.props.communityDomainExists) {
      this.setState({
        error: 'This URL is invalid. Try another.'
      })
    } else if (this.state.communityDomain === '') {
      this.setState({
        error: 'Please add a URL.'
      })
    } else if (!slugValidatorRegex.test(this.removeUrlFromDomain(this.state.communityDomain))) {
      this.setState({
        error: 'URLs can only have lower case letters, numbers, and dashes.'
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

  formatDomainWithUrl (communityDomain) {
    let formattedDomain = communityDomain.replace('hylo.com/c/', '').replace('hylo.com/c', '')
    if (formattedDomain !== '') {
      formattedDomain = 'hylo.com/c/' + formattedDomain
    }
    return formattedDomain
  }

  removeUrlFromDomain (communityDomain) {
    return communityDomain.replace('hylo.com/c/', '')
  }

  imageChooser = () => {
    if (this.state.communityDomain !== '') {
      return happyAxolotl
    }
    return confusedAxolotl
  }

  componentWillMount = () => {
    const { communityDomain } = this.props
    if (communityDomain) this.setState({communityDomain: communityDomain})
  }
  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
        imageUrl={this.imageChooser()}
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header='Choose an address for your community'
        body='Your URL is the address that people will use to access your community online.'
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
          <span styleName='text-input-label'>{ this.state.communityDomain && 'Choose a URL'}</span>
          <TextInput
            type='text'
            name='community-name'
            value={this.formatDomainWithUrl(this.state.communityDomain)}
            onChange={this.handleDomainChange}
            theme={inputTheme}
            placeholder='Choose a URL'
            showClearButton={false}
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
