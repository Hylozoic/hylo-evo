import React from 'react'

import './PersonProfile.scss'
import RoundImage from 'components/RoundImage'

const { any, arrayOf, object, string, shape } = React.PropTypes

export default class PersonProfile extends React.Component {
  static propTypes = {
    id: any,
    person: shape({
      id: any.isRequired,
      name: string,
      avatarUrl: string,
      posts: arrayOf(object),
      postsTotal: any
    })
  }

  componentDidMount () {
    this.props.fetchPerson(this.props.id)
  }

  render () {
    const { person } = this.props

    return <div styleName='user-profile'>
      <RoundImage url={person.avatarUrl} />
      <h1>{person.name}</h1>
    </div>
  }
}
