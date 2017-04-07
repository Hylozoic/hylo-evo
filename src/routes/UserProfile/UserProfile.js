import React from 'react'
import './UserProfile.scss'

const { any, array, string, shape } = React.PropTypes

export default class UserProfile extends React.Component {
  static defaultProps = {
    person: {
      name: ''
    }
  }

  static propTypes = {
    id: any,
    person: shape({
      id: any,
      name: string,
      avatarUrl: string,
      posts: array,
      postsTotal: any
    })
  }

  componentDidMount () {
    this.props.fetchPerson(this.props.id)
  }

  render () {
    const { person } = this.props

    return <div styleName='user-profile'>
      <h1>{person.name}</h1>
    </div>
  }
}
