import React, { Component } from 'react'
import '../CreateGroup.scss'
import ModalSidebar from 'components/ModalSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { find } from 'lodash'
import { get } from 'lodash/fp'

export default class Privacy extends Component {
  constructor () {
    super()
    this.state = {
      // Set to 'private' by default
      selectedPrivacy: 1
    }
  }

  submit = () => {
    // * Find out how this will actuall be saved in the db.
    //   Currently set to be saved by label
    this.props.addGroupPrivacy(privacyOptions[this.state.selectedPrivacy].label)
    this.props.goToNextStep()
  }

  selectPrivacy = (selectedPrivacy) => {
    this.setState({
      selectedPrivacy
    })
  }

  componentWillMount = () => {
    const { groupPrivacy } = this.props
    const privacyOption = find(privacyOptions, { label: groupPrivacy })
    this.setState({ selectedPrivacy: get('id', privacyOption) || 1 })
  }
  render () {
    return <div styleName='flex-wrapper'>
      <ModalSidebar
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header="Great, let's get started"
        body="All good things start somewhere! Let's kick things off with a catchy name for your group."
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 3/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically privacy-label-row'>
          <span styleName='privacy-input-label'>SET THE PRIVACY LEVEL</span>
          <br />
          <span styleName='privacy-label'>This group is</span>
          <Dropdown styleName='privacy-dropdown'
            toggleChildren={<span>
              {privacyOptions[this.state.selectedPrivacy].label}
              <Icon name='ArrowDown' />
            </span>}
            items={privacyOptions.map(({ id, label }) => ({
              label,
              onClick: () => this.selectPrivacy(id)
            }))}
            alignRight />
        </div>
      </div>
      <ModalFooter
        submit={this.submit}
        previous={this.props.goToPreviousStep}
        continueText={'Continue'}
      />
    </div>
  }
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
