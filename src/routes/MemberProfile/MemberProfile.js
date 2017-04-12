import React from 'react'

import './MemberProfile.scss'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { bgImageStyle } from 'util/index'

import SimpleTabBar from 'components/SimpleTabBar'

const { any, arrayOf, object, string, shape } = React.PropTypes

export default class MemberProfile extends React.Component {
  static propTypes = {
    id: any,
    person: shape({
      id: any,
      name: string,
      avatarUrl: string,
      posts: arrayOf(object),
      postsTotal: any
    })
  }

  componentDidMount () {
    this.props.fetchPerson(this.props.id)
  }

  displayError (error) {
    return <div styleName='member-profile'>
      <span styleName='error'>{ error }</span>
    </div>
  }

  render () {
    if (this.props.error) return this.displayError(this.props.error)

    const {
      avatarUrl,
      bannerUrl,
      facebookUrl,
      linkedinUrl,
      location,
      name,
      role,
      twitterName,
      url
    } = this.props.person

    return <div styleName='member-profile'>
      <ProfileBanner
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
        location={location}
        name={name}
        role={role} />
      <div styleName='content'>
        <ProfileControls
          facebookUrl={facebookUrl}
          linkedinUrl={linkedinUrl}
          twitterName={twitterName}
          url={url} />
        <h2 styleName='subhead'>About me</h2>
      </div>
    </div>
  }
}

export function ProfileBanner ({ avatarUrl, bannerUrl, location, name, role }) {
  return <div styleName='banner'>
    <ProfileNamePlate
      avatarUrl={avatarUrl}
      location={location}
      name={name}
      role={role} />
    {bannerUrl && <div style={bgImageStyle(bannerUrl)} styleName='banner-image' />}
  </div>
}

export function ProfileNamePlate ({ avatarUrl, name, location, role }) {
  return <div styleName='name-plate'>
    <RoundImage url={avatarUrl} xlarge />
    <div styleName='details'>
      <h1 styleName='name'>{name}</h1>
      <span styleName='location'>{location}</span>
      {role && <span styleName='spacer'>•</span>}
      {role && <span styleName='role'>{ role }</span>}
    </div>
  </div>
}

export function ProfileControls ({ facebookUrl, linkedinUrl, twitterName, url }) {
  return <div styleName='controls'>
    <SocialButtons
      facebookUrl={facebookUrl}
      linkedinUrl={linkedinUrl}
      twitterName={twitterName}
      url={url} />
    <hr styleName='separator' />
    <SimpleTabBar
      currentTab='Overview'
      tabNames={['Overview', 'Posts', 'Comments', 'Upvotes']} />
  </div>
}

export function SocialButtons ({ facebookUrl, linkedinUrl, twitterName, url }) {
  return <ul styleName='social-buttons'>
    {facebookUrl && <li><a href={facebookUrl}><Icon name='ArrowUp' /></a></li>}
    {linkedinUrl && <li><a href={linkedinUrl}><Icon name='ArrowUp' /></a></li>}
    {twitterName && <li><a href={twitterName}><Icon name='ArrowUp' /></a></li>}
    {url && <li><a href={url}><Icon name='ArrowUp' /></a></li>}
  </ul>
}
