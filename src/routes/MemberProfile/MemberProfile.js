import React from 'react'

import './MemberProfile.scss'
import RoundImage from 'components/RoundImage'

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

    const { person } = this.props
    const { avatarUrl, bannerUrl, location, name, role } = person

    return <div styleName='member-profile'>
      <ProfileBanner avatarUrl={avatarUrl} bannerUrl={bannerUrl} name={name} location={location} role={role} />
    </div>
  }
}

export function ProfileBanner ({ avatarUrl, bannerUrl, location, name, role }) {
  return <div styleName='banner'>
    <ProfileNamePlate avatarUrl={avatarUrl} name={name} location={location} role={role} />
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
