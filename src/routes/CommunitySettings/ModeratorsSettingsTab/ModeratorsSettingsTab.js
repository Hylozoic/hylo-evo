import React, { PropTypes, Component } from 'react'
import styles from './ModeratorsSettingsTab.scss'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import { KeyControlledItemList } from 'components/KeyControlledList'
const { array, func, string } = PropTypes
import { personUrl } from 'util/index'
import { isEmpty } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'

export default class ModeratorsSettingsTab extends Component {
  static propTypes = {
    moderators: array,
    removeModerator: func,
    addModerator: func,
    slug: string
  }

  componentWillUnmount () {
    this.props.clearModeratorSuggestions()
  }

  render () {
    const {
      moderators,
      removeModerator,
      fetchModeratorSuggestions,
      addModerator,
      moderatorSuggestions,
      clearModeratorSuggestions
    } = this.props

    if (!moderators) return <Loading />

    return <div>
      <div>
        {moderators.map(m =>
          <ModeratorControl moderator={m} removeModerator={removeModerator} key={m.id} />)}
      </div>
      <AddModerator
        fetchModeratorSuggestions={fetchModeratorSuggestions}
        addModerator={addModerator}
        moderatorSuggestions={moderatorSuggestions}
        clearModeratorSuggestions={clearModeratorSuggestions} />
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
    fetchModeratorSuggestions: func
  }

  constructor (props) {
    super(props)
    this.state = {
      adding: true
    }
  }

  render () {
    const { fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions } = this.props

    const { adding } = this.state

    const toggle = () => {
      this.setState({adding: !adding})
    }

    const onInputChange = e => {
      if (e.target.value.length === 0) return clearModeratorSuggestions()
      return fetchModeratorSuggestions(e.target.value)
    }

    const onChoose = choice => {
      addModerator(choice.id)
      clearModeratorSuggestions()
      toggle()
    }

    const chooseCurrentItem = () => {
      if (!this.refs.list) return
      return this.refs.list.handleKeys({
        keyCode: keyMap.ENTER,
        preventDefault: () => {}
      })
    }

    const handleKeys = e => {
      if (getKeyCode(e) === keyMap.ESC) {
        toggle()
        return clearModeratorSuggestions()
      }
      if (!this.refs.list) return
      return this.refs.list.handleKeys(e)
    }

    if (adding) {
      return <div styleName='add-moderator adding'>
        <div styleName='help-text'>Search here for members to grant moderator powers</div>
        <div styleName='input-row'>
          <input styleName='input'
            placeholder='Type...'
            type='text'
            onChange={onInputChange}
            onKeyDown={handleKeys} />
          <span styleName='cancel-button' onClick={toggle}>Cancel</span>
          <span styleName='add-button' onClick={chooseCurrentItem}>Add</span>
        </div>
        {!isEmpty(moderatorSuggestions) && <KeyControlledItemList
          ref='list'
          items={moderatorSuggestions}
          onChange={onChoose}
          theme={styles} />}
      </div>
    } else {
      return <div styleName='add-moderator add-new' onClick={toggle}>
        + Add New
      </div>
    }
  }
}
