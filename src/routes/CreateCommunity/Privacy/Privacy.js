import React, { Component } from 'react'
import '../CreateCommunity.scss'
import ModalSidebar from 'components/ModalSidebar'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from 'components/ModalFooter'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'

export default class Privacy extends Component {
  constructor () {
    super()
    this.state = {
      privacy: 'Public'
    }
  }

  submit = () => {
    this.props.addCommunityPrivacy(this.state.privacy)
    this.props.goToNextStep()
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
          <span styleName='step-count'>STEP 3/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='center-vertically privacy-label-row'>
          <span styleName='privacy-input-label'>SET THE PRIVACY LEVEL</span>
          <br />
          <span styleName='privacy-label'>This community is</span>
          <Dropdown styleName='privacy-dropdown'
            toggleChildren={<span styleName=''>
              {sortOptions[0].label}
              <Icon name='ArrowDown' />
            </span>}
            items={sortOptions.map(({ id, label }) => ({
              label,
              onClick: console.log('onChangeSort')
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

const sortOptions = [
  {id: 'updated', label: 'Latest'},
  {id: 'votes', label: 'Popular'}
]
