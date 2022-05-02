import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { set } from 'lodash'
import SettingsSection from '../SettingsSection'
import Button from 'components/Button'
import SwitchStyled from 'components/SwitchStyled'
import Loading from 'components/Loading'
import './DataSettingsTab.scss'
const { object } = PropTypes

export default class GroupSettingsTab extends Component {
  static propTypes = {
    group: object,
    fetchPending: object
  }

  constructor (props) {
    super(props)
    this.state = this.defaultEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setState(this.defaultEditState())
    }
  }

  defaultEditState () {
    const { group } = this.props

    if (!group) return { edits: {}, changed: false }

    const {
      settings
    } = group

    return {
      edits: {
        settings: typeof settings !== 'undefined' ? settings : { }
      },
      changed: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    set(edits, key, event.target.value)

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  save = async () => {
    this.setState({ changed: false })
    this.props.updateGroupSettings({ ...this.state.edits })
  }

  render () {
    const { group } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      settings
    } = edits
    const { hideExtensionData } = settings

    return (
      <div styleName='groupSettings'>
        <SettingsSection>
          <h3>Hide Extension Data</h3>
          <p styleName='dataDetail'>If the group has extra data loaded in an extension (such as a farm group)</p>
          <div styleName='switchContainer'>
            <SwitchStyled
              checked={hideExtensionData}
              onChange={() => this.updateSettingDirectly('settings.hideExtensionData')(hideExtensionData === undefined || hideExtensionData === null || !hideExtensionData)}
              backgroundColor={hideExtensionData ? '#0DC39F' : '#8B96A4'}
            />
            <span styleName='toggleDescription'>Hide extension data for this group</span>
            <div styleName='onOff'>
              {!hideExtensionData && hideExtensionData !== null && <div styleName='off'>OFF</div>}
              {hideExtensionData && <div styleName='on'>ON</div>}
            </div>
          </div>
        </SettingsSection>

        <div styleName='saveChanges'>
          <span styleName={changed ? 'settingChanged' : ''}>{changed ? 'Changes not saved' : 'Current settings up to date'}</span>
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
        </div>
      </div>
    )
  }
}
