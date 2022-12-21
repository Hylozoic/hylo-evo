import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { get } from 'lodash/fp'
import '../WelcomeWizard.scss'

class WelcomeExplore extends Component {
  getValue = (field) => {
    return get(field, this.props.currentUser)
  }

  render () {
    const { currentUser, t } = this.props
    const currentAvatarUrl = this.getValue('avatarUrl')

    return (
      <div styleName='flex-wrapper final-wrapper'>
        <div styleName='panel final-panel'>
          <div styleName='instructions'>
            <h3>{this.props.t('Welcome to Hylo!')}</h3>
            <p>We're glad you're here, {currentUser.name.split(' ')[0]}. To get started, explore public groups and posts, or create your own group!</p>
          </div>
          <Link to='/public/map?hideDrawer=true'>
            <div styleName='final-step'>
              <div styleName='step-image map' style={bgImageStyle('/signup-globe.png')} />
              <div>
                <h4>{this.props.t('View the public map')}</h4>
                <p>{this.props.t('Find out what\'s happening around you, and groups you can join')}</p>
              </div>
            </div>
          </Link>
          <Link to='/public'>
            <div styleName='final-step'>
              <div styleName='step-image stream' style={bgImageStyle('/signup-stream.png')} />
              <div>
                <h4>{this.props.t('Public stream')}</h4>
                <p>{this.props.t('View and participate in public discussions, projects, events & more')}</p>
              </div>
            </div>
          </Link>
          <Link to={`/public/create/group?closePath=${encodeURIComponent('/public')}`}>
            <div styleName='final-step'>
              <div styleName='step-image group' style={bgImageStyle('/signup-group.png')} />
              <div>
                <h4>{this.props.t('Create a group')}</h4>
                <p>{this.props.t('Gather your collaborators & people who share your interests')}</p>
              </div>
            </div>
          </Link>
          <Link to='/settings'>
            <div styleName='final-step'>
              <div styleName='step-image profile' style={bgImageStyle(currentAvatarUrl)}><div styleName='profile-cover' /></div>
              <div>
                <h4>{this.props.t('Complete your profile')}</h4>
                <p>{this.props.t('Share about who you are, your skills & interests')}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
export default withTranslation()(WelcomeExplore)
