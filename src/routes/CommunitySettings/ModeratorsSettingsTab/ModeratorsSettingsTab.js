import React, { PropTypes, Component } from 'react'
import './ModeratorsSettingsTab.scss'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
const { array, func, string } = PropTypes
import { personUrl } from 'util/index'

export default class ModeratorsSettingsTab extends Component {
  static propTypes = {
    moderators: array,
    removeModerator: func,
    addModerator: func,
    slug: string
  }

  render () {
    const { moderators, removeModerator, findModerators, addModerator } = this.props
    if (!moderators) return <Loading />

    console.log('in render, findModerators', findModerators)

    return <div>
      <div>
        {moderators.map(m =>
          <ModeratorControl moderator={m} removeModerator={removeModerator} key={m.id} />)}
      </div>
      <AddModerator findModerators={findModerators} addModerator={addModerator} />
    </div>
  }
}

export function ModeratorControl ({ moderator, slug, removeModerator }) {
  const remove = () => {
    if (window.confirm(`Are you sure you want to remove ${moderator.name}'s moderator powers?`)) {
      removeModerator(moderator.id)
    }
  }
  return <div styleName='moderator-control'>
    <Link to={personUrl(moderator.id, slug)}>
      <RoundImage url={moderator.avatarUrl} medium styleName='avatar' />
    </Link>
    <Link to={personUrl(moderator.id, slug)} styleName='name'>{moderator.name}</Link>
    <span onClick={remove} styleName='remove-button'>Remove</span>
  </div>
}

export class AddModerator extends Component {
  static propTypes = {
    addModerator: func,
    findModerators: func
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: true
    }
  }

  render () {
    const { findModerators, addModerator } = this.props

    const { adding } = this.state

    const toggle = () => {
      this.setState({adding: !adding})
    }

    const onChange = e => findModerators(e.target.value)

    if (adding) {
      return <div styleName='add-moderator adding'>
        <input type='text' onChange={onChange} />
        <span styleName='cancel-button' onClick={toggle}>Cancel</span>
        <span styleName='add-button' onClick={toggle}>Add</span>
      </div>
    } else {
      return <div styleName='add-moderator add-new' onClick={toggle}>
        + Add New
      </div>
    }
  }
}
