import React, { Component } from 'react'
import '../CreateCommunity.scss'
import ModalSidebar from 'components/ModalSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'

export default class Domain extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'communityDomain': ''
    }
  }

  formatDomainWithUrl (communityDomain) {
    let c = communityDomain.replace('hylo.com/c/', '').replace('hylo.com/c', '')
    if (c !== '') {
      c = 'hylo.com/c/' + c
    }
    return c
  }

  removeUrlFromDomain (communityDomain) {
    return communityDomain.replace('hylo.com/c/', '')
  }

  handleDomainChange = (event) => {
    const communityDomain = event.target.value
    this.setState({
      communityDomain: this.formatDomainWithUrl(communityDomain)
    })
  }

  submit = () => {
    const communityDomain = this.state.communityDomain
    this.props.addCommunityDomain(this.removeUrlFromDomain(communityDomain))
    this.props.goToNextStep()
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.submit()
    }
  }

  communityDomainWithUrl = () => {
    return `${this.props.communityDomain}.hylo.com`
  }

  componentWillMount = () => {
    const { communityDomain } = this.props
    if (communityDomain) this.setState({communityDomain: communityDomain})
  }
  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
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
          <span styleName='text-input-label'>{ this.state.communityDomain && 'Choose a domain name'}</span>
          <TextInput
            type='text'
            name='community-name'
            value={this.state.communityDomain}
            onChange={this.handleDomainChange}
            theme={inputTheme}
            placeholder='Choose a domain name'
            showClearButton={false}
            onEnter={this.onEnter}
          />
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
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
