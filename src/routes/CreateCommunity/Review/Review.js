import React, { Component } from 'react'
import '../CreateCommunity.scss'
import LeftSidebar from '../../Signup/LeftSidebar'
import TextInput from 'components/TextInput'
import { hyloNameWhiteBackground } from 'util/assets'
import { bgImageStyle } from 'util/index'
import ModalFooter from '../ModalFooter'

export default class Review extends Component {
  constructor () {
    super()
    this.state = {
      readOnly: {
        name: true,
        email: true,
        communityName: true,
        communityDomain: true
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

  submit = () => {
    console.log('submit')
  }

  render () {
    const { currentUser } = this.props
    return <div styleName='flex-wrapper'>
      <LeftSidebar
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
            value={currentUser && currentUser.name}
            readOnly={this.state.readOnly.name}
            editHandler={() => this.editHandler('name')}
            onEnter={this.onEnter}
          />
          <ReviewTextInput
            label={'Your Email'}
            value={currentUser && currentUser.email}
            readOnly={this.state.readOnly.email}
            editHandler={() => this.editHandler('email')}
            onEnter={this.onEnter}
          />
          <ReviewTextInput
            label={'Community Name'}
            value={this.props.communityName}
            readOnly={this.state.readOnly.communityName}
            editHandler={() => this.editHandler('communityName')}
            onEnter={this.onEnter}
          />
          <ReviewTextInput
            label={'Domain'}
            value={this.props.communityDomain}
            readOnly={this.state.readOnly.communityDomain}
            editHandler={() => this.editHandler('communityDomain')}
            onEnter={this.onEnter}
          />
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

export function ReviewTextInput ({label, value, editHandler, readOnly = true}) {
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
