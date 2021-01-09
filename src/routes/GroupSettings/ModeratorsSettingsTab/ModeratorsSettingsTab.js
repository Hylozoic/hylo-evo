import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './ModeratorsSettingsTab.scss'
import Loading from 'components/Loading'
import { KeyControlledItemList } from 'components/KeyControlledList'
import RemovableListItem from 'components/RemovableListItem'
import { isEmpty, get } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import { personUrl } from 'util/navigation'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'

const { array, func, string } = PropTypes

export default class ModeratorsSettingsTab extends Component {
  static propTypes = {
    moderators: array,
    removeModerator: func,
    addModerator: func,
    slug: string
  }

  state = {
    modalVisible: false
  }

  componentWillUnmount () {
    this.props.clearModeratorSuggestions()
  }

  submitRemoveModerator = () => {
    this.props.removeModerator(this.state.moderatorToRemove, this.state.isRemoveFromGroup)
  }

  render () {
    const {
      moderators
    } = this.props

    const {
      modalVisible,
      isRemoveFromGroup
    } = this.state

    if (!moderators) return <Loading />

    return <React.Fragment>
      <ModeratorsList key='mList' {...this.props} removeItem={(id) => this.setState({ modalVisible: true, moderatorToRemove: id })} />
      {modalVisible && <ModalDialog key='remove-moderator-dialog'
        closeModal={() => this.setState({ modalVisible: false })}
        showModalTitle={false}
        submitButtonAction={this.submitRemoveModerator}
        submitButtonText='Remove' >
        <div styleName='content'>
          <div styleName='modal-text'>Are you sure you wish to remove this moderator?</div>
          <CheckBox checked={isRemoveFromGroup} label='Remove from group as well' onChange={value => this.setState({ isRemoveFromGroup: value })} />
        </div>
      </ModalDialog>}
    </React.Fragment>
  }
}

export function ModeratorsList ({ moderators, slug, removeItem, fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions }) {
  return <div>
    <div>
      {moderators.map(m =>
        <RemovableListItem
          item={m}
          url={personUrl(m.id, slug)}
          skipConfirm
          removeItem={removeItem}
          key={m.id} />)}
    </div>
    <AddModerator
      fetchModeratorSuggestions={fetchModeratorSuggestions}
      addModerator={addModerator}
      moderatorSuggestions={moderatorSuggestions}
      clearModeratorSuggestions={clearModeratorSuggestions} />
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
      adding: false
    }
  }

  render () {
    const { fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions } = this.props

    const { adding } = this.state

    const toggle = () => {
      this.setState({ adding: !adding })
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

    const listWidth = { width: get('refs.input.clientWidth', this, 0) + 4 }

    if (adding) {
      return <div styleName='add-moderator adding'>
        <div styleName='help-text'>Search here for members to grant moderator powers</div>
        <div styleName='input-row'>
          <input styleName='input'
            placeholder='Type...'
            type='text'
            onChange={onInputChange}
            onKeyDown={handleKeys}
            ref='input' />
          <span styleName='cancel-button' onClick={toggle}>Cancel</span>
          <span styleName='add-button' onClick={chooseCurrentItem}>Add</span>
        </div>
        {!isEmpty(moderatorSuggestions) && <div style={listWidth}>
          <KeyControlledItemList
            ref='list'
            items={moderatorSuggestions}
            onChange={onChoose}
            theme={styles} />
        </div>}
      </div>
    } else {
      return <div styleName='add-moderator add-new' onClick={toggle}>
        + Add New
      </div>
    }
  }
}
