import React from 'react'

import './PersonProfile.scss'
import RoundImage from 'components/RoundImage'

const { any, arrayOf, object, string, shape } = React.PropTypes

export default class PersonProfile extends React.Component {
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
    return <div styleName='person-profile'>
      <span styleName='error'>{ error }</span>
    </div>
  }

  render () {
    if (this.props.error) return this.displayError(this.props.error)

    const { person } = this.props
    const { avatarUrl, bannerUrl, name } = person

    return <div styleName='person-profile'>
      <ProfileHeader avatarUrl={avatarUrl} bannerUrl={bannerUrl} name={name} />
    </div>
  }
}

export function ProfileHeader ({ avatarUrl, bannerUrl, name }) {
  return <div styleName='profile-header'>
    <RoundImage url={avatarUrl} />
    <h1>{name}</h1>
  </div>
}
