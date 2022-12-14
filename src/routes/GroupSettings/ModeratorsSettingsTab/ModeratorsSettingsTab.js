import PropTypes from 'prop-types'
import React, { Component, useEffect, useRef, useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import styles from './ModeratorsSettingsTab.scss'
import Loading from 'components/Loading'
import { KeyControlledItemList } from 'components/KeyControlledList'
import RemovableListItem from 'components/RemovableListItem'
import { isEmpty } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import { personUrl } from 'util/navigation'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'

const { array, func, string } = PropTypes

class ModeratorsSettingsTab extends Component {
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

  closeModal = () => {
    this.setState({ modalVisible: false })
  }

  submitRemoveModerator = () => {
    this.props.removeModerator(this.state.moderatorToRemove, this.state.isRemoveFromGroup)
  }

  removeItemHandler = (id) => {
    this.setState({ modalVisible: true, moderatorToRemove: id })
  }

  removeFromGroupCheckoxHandler = (value) => {
    this.setState({ isRemoveFromGroup: value })
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
      <ModeratorsList key='mList' {...this.props} removeItem={(id) => this.removeItemHandler(id)} />
      {modalVisible &&
        <ModalDialog key='remove-moderator-dialog'
          closeModal={this.closeModal}
          showModalTitle={false}
          submitButtonAction={this.submitRemoveModerator}
          submitButtonText={this.props.t('Remove')}>
          <div styleName='content'>
            <div styleName='modal-text'>{this.props.t('Are you sure you wish to remove this moderator?')}</div>
            <CheckBox checked={isRemoveFromGroup} label={this.props.t('Remove from group as well')} onChange={value => this.removeFromGroupCheckoxHandler(value)} />
          </div>
        </ModalDialog>
      }
    </React.Fragment>
  }
}

export function ModeratorsList ({ moderators, slug, removeItem, fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions }) {
  return (
    <div>
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
  )
}

export function AddModerator (props) {
  const { t } = useTranslation()
  const { fetchModeratorSuggestions, addModerator, moderatorSuggestions, clearModeratorSuggestions } = props

  const [adding, setAdding] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const inputRef = useRef()
  const listRef = useRef()

  const toggle = () => setAdding(!adding)

  useEffect(() => {
    return () => clearModeratorSuggestions()
  }, [])

  const inputUpdateHandler = e => {
    const value = e.target.value
    if (value === '') {
      clearModeratorSuggestions()
    } else {
      fetchModeratorSuggestions(value)
    }
    setInputValue(e.target.value)
  }

  const onChoose = choice => {
    addModerator(choice.id)
    clearModeratorSuggestions()
    toggle()
  }

  const chooseCurrentItem = () => {
    if (!listRef.current) return
    return listRef.current.handleKeys({
      keyCode: keyMap.ENTER,
      preventDefault: () => {}
    })
  }

  const handleKeys = e => {
    if (getKeyCode(e) === keyMap.ESC) {
      toggle()
      return clearModeratorSuggestions()
    }
    if (!listRef.current) return
    return listRef.current.handleKeys(e)
  }

  const listWidth = { width: inputRef.current?.clientWidth + 4 }

  return adding ? (
    <div styleName='add-moderator adding'>
      <div styleName='help-text'>{t('Search here for members to grant moderator powers')}</div>
      <div styleName='input-row'>
        <input styleName='input'
          placeholder={t('Type...')}
          type='text'
          onChange={e => inputUpdateHandler(e)}
          value={inputValue}
          onKeyDown={handleKeys}
          ref={inputRef} />
        <span className='cancel-button' styleName='cancel-button' onClick={toggle}>{t('Cancel')}</span>
        <span className='add-button' styleName='add-button' onClick={chooseCurrentItem}>{t('Add')}</span>
      </div>
      {!isEmpty(moderatorSuggestions) &&
      <div style={listWidth}>
        <KeyControlledItemList
          ref={listRef}
          items={moderatorSuggestions}
          onChange={onChoose}
          theme={styles}
        />
      </div>
      }
    </div>
  ) : (<div className='add-new' styleName='add-moderator add-new' onClick={toggle}>{t('+ Add New')}</div>)
}
export default withTranslation()(ModeratorsSettingsTab)
