import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './ModeratorsSettingsTab.scss'
import Loading from 'components/Loading'
import { KeyControlledItemList } from 'components/KeyControlledList'
import RemovableListItem from 'components/RemovableListItem'
import { isEmpty, get } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import { personUrl } from 'util/index'
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
    this.props.removeModerator(this.state.moderatorToRemove, this.state.isRemoveFromCommunity)
  }

  render () {
    const {
      moderators,
      fetchModeratorSuggestions,
      addModerator,
      moderatorSuggestions,
      clearModeratorSuggestions,
      slug
    } = this.props

    const {
      modalVisible,
      isRemoveFromCommunity
    } = this.state

    if (!moderators) return <Loading />

    return [<div>
      <div>
        {moderators.map(m =>
          <RemovableListItem
            item={m}
            url={personUrl(m.id, slug)}
            skipConfirm
            removeItem={id => this.setState({modalVisible: true, moderatorToRemove: id})}
            key={m.id} />)}
      </div>
      <AddModerator
        fetchModeratorSuggestions={fetchModeratorSuggestions}
        addModerator={addModerator}
        moderatorSuggestions={moderatorSuggestions}
        clearModeratorSuggestions={clearModeratorSuggestions} />
    </div>,
      modalVisible && <ModalDialog key='remove-moderator-dialog'
        closeModal={() => this.setState({modalVisible: false})}
        closeOnSubmit
        showModalTitle={false}
        showCancelButton
        showSubmitButton
        submitButtonAction={this.submitRemoveModerator}
        submitButtonText='Remove' >
        <div styleName='content'>
          <div styleName='modal-text'>Are you sure you wish to remove this moderator?</div>
          <CheckBox checked={isRemoveFromCommunity} label='Remove from community as well' onChange={value => this.setState({isRemoveFromCommunity: value})} />
        </div>
      </ModalDialog>
    ]
  }
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

    const listWidth = {width: get('refs.input.clientWidth', this, 0) + 4}

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
