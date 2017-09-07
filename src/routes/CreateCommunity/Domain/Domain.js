import React, { Component } from 'react'
import '../CreateCommunity.scss'
import LeftSidebar from '../../Signup/LeftSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from '../ModalFooter'

const theme = {
  inputStyle: 'modal-input',
  wrapperStyle: 'center'
}

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}
export default class Domain extends Component {
  constructor (props) {
    super(props)
    this.state = {
      'domain': ''
    }
  }

  handleDomainChange = (event) => {
    const domain = event.target.value
    this.setState({
      domain
    })
  }

  submit = () => {
    this.props.addCommunityDomain(this.state.domain)
    this.props.goToNextStep()
  }

  componentWillMount = () => {
    const { domainName } = this.props
    if (domainName) this.setState({domain: domainName})
  }
  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        theme={sidebarTheme}
        header='Choose an address for your community'
        body='Your URL is the address that members will use to access your community online. The shorter the better!'
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 2/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically'>
          <span styleName='text-input-label'>Choose a domain name</span>
          <TextInput
            type='text'
            name='community-name'
            value={this.state.domain}
            onChange={this.handleDomainChange}
            theme={theme}
            placeholder='Choose a domain name'
            showClearButton={false}
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
