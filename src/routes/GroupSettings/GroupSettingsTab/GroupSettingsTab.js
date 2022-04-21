import { set, trim } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import Icon from 'components/Icon'
import './GroupSettingsTab.scss'
import SettingsSection from '../SettingsSection'
import Button from 'components/Button'
import GroupsSelector from 'components/GroupsSelector'
import EditableMap from 'components/Map/EditableMap'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SwitchStyled from 'components/SwitchStyled'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import {
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  GROUP_ACCESSIBILITY,
  GROUP_VISIBILITY,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
const { object, func } = PropTypes

export default class GroupSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    group: object,
    fetchLocation: func,
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
      accessibility, avatarUrl, bannerUrl, description, geoShape, groupToGroupJoinQuestions, location, locationObject, name, joinQuestions, prerequisiteGroups, settings, visibility
    } = group

    return {
      edits: {
        accessibility: typeof accessibility !== 'undefined' ? accessibility : GROUP_ACCESSIBILITY.Restricted,
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        description: description || '',
        geoShape: geoShape || null,
        groupToGroupJoinQuestions: groupToGroupJoinQuestions ? groupToGroupJoinQuestions.concat({ text: '' }) : [{ text: '' }],
        location: location || '',
        locationId: locationObject ? locationObject.id : '',
        name: name || '',
        joinQuestions: joinQuestions ? joinQuestions.concat({ text: '' }) : [{ text: '' }],
        prerequisiteGroups: prerequisiteGroups || [],
        settings: typeof settings !== 'undefined' ? settings : { },
        visibility: typeof visibility !== 'undefined' ? visibility : GROUP_VISIBILITY.Protected
      },
      changed: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else if (key === 'accessibility' || key === 'visibility') {
      edits[key] = parseInt(event.target.value)
    } else {
      set(edits, key, event.target.value)
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  savePolygon = (polygon) => {
    const { edits } = this.state
    this.setState({
      changed: true,
      edits: { ...edits, geoShape: polygon?.geometry }
    })
  }

  save = async () => {
    this.setState({ changed: false })
    const { group, fetchLocation } = this.props
    let locationId = this.state.edits.locationId
    if (group && this.state.edits.location !== group.location) {
      locationId = await ensureLocationIdIfCoordinate({ fetchLocation, location: this.state.edits.location, locationId })
    }

    this.props.updateGroupSettings({ ...this.state.edits, locationId })
  }

  render () {
    const { currentUser, group, parentGroups } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      accessibility, avatarUrl, bannerUrl, description, geoShape, groupToGroupJoinQuestions, joinQuestions, location, name, prerequisiteGroups, settings, visibility
    } = edits
    const { askGroupToGroupJoinQuestions, showSuggestedSkills } = settings

    const locationObject = group.locationObject || currentUser.locationObject

    return <div styleName='groupSettings'>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <UploadAttachmentButton
          type='groupBanner'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <UploadAttachmentButton
          type='groupAvatar'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Description' onChange={this.updateSetting('description')} value={description} type='textarea' />
      <SettingsControl
        label='Location'
        onChange={this.updateSettingDirectly('location', true)}
        location={location}
        locationObject={locationObject}
        type='location'
      />
      <div style={{ width: '100%', height: '275px' }}>
        <label styleName='control-label'>Group Shape</label>
        <EditableMap locationObject={group?.locationObject || null} polygon={geoShape} savePolygon={this.savePolygon} />
      </div>
      <div styleName='privacy-settings'>
        <SettingsSection>
          <h3>Visibility</h3>
          <p styleName='privacyDetail'>Who is able to see <strong>{group.name}</strong>?</p>
          {Object.values(GROUP_VISIBILITY).map(visibilitySetting =>
            <VisibilitySettingRow
              key={visibilitySetting}
              forSetting={visibilitySetting}
              currentSetting={visibility}
              updateSetting={this.updateSetting}
            />
          )}
        </SettingsSection>

        <SettingsSection>
          <h3>Access</h3>
          <p styleName='privacyDetail'>How can people become members of <strong>{group.name}</strong>?</p>
          {Object.values(GROUP_ACCESSIBILITY).map(accessSetting =>
            <AccessibilitySettingRow
              key={accessSetting}
              forSetting={accessSetting}
              clearField={this.clearField}
              currentSetting={accessibility}
              askJoinQuestions={settings && settings.askJoinQuestions}
              joinQuestions={joinQuestions}
              updateJoinQuestion={this.updateJoinQuestion}
              updateSetting={this.updateSetting}
              updateSettingDirectly={this.updateSettingDirectly}
            />
          )}
        </SettingsSection>

        <SettingsSection>
          <h3>Prerequisite Groups</h3>
          <p styleName='privacyDetail'>When you select a prerequisite group, people must join the selected groups before joining <strong>{group.name}</strong>. Only parent groups can be added as prerequisite groups.</p>
          <p styleName='prerequisiteWarning'><strong styleName='warning'>Warning:</strong> If you select a prerequisite group that has a visibility setting of <strong><Icon name='Hidden' styleName='prerequisiteIcon' /> Hidden</strong> or <strong><Icon name='Shield' styleName='prerequisiteIcon' /> Protected</strong>, only members of those groups will be able to join this group. Because of these settings, people who find your group will not be able to see the prerequisite group.</p>
          <GroupsSelector
            options={parentGroups}
            selected={prerequisiteGroups}
            onChange={this.updateSettingDirectly('prerequisiteGroups')}
            groupSettings
          />
        </SettingsSection>
      </div>

      <SettingsSection>
        <h3>Relevant skills &amp; interests</h3>
        <p styleName='privacyDetail'>What skills and interests are relevant to this group?</p>
        <div styleName={'skillsSetting' + ' ' + cx({ on: showSuggestedSkills })}>
          <div styleName='switchContainer'>
            <SwitchStyled
              checked={showSuggestedSkills}
              onChange={() => this.updateSettingDirectly('settings.showSuggestedSkills')(!showSuggestedSkills)}
              backgroundColor={showSuggestedSkills ? '#0DC39F' : '#8B96A4'} />
            <span styleName='toggleDescription'>Ask new members to fill out their skills and interests?</span>
            <div styleName='onOff'>
              <div styleName='off'>OFF</div>
              <div styleName='on'>ON</div>
            </div>
          </div>
        </div>
        <SkillsSection
          group={group}
          label='Add a relevant skill or interest'
          placeholder='What skills and interests are most relevant to your group?' />
      </SettingsSection>

      <SettingsSection>
        <h3>Group Access Questions</h3>
        <p styleName='privacyDetail'>What questions are asked when a group requests to join this group?</p>

        <div styleName={'groupQuestions' + ' ' + cx({ on: askGroupToGroupJoinQuestions })}>
          <div styleName='switchContainer'>
            <SwitchStyled
              checked={askGroupToGroupJoinQuestions}
              onChange={() => this.updateSettingDirectly('settings.askGroupToGroupJoinQuestions')(!askGroupToGroupJoinQuestions)}
              backgroundColor={askGroupToGroupJoinQuestions ? '#0DC39F' : '#8B96A4'} />
            <span styleName='toggleDescription'>Require groups to answer questions when requesting to join this group</span>
            <div styleName='onOff'>
              <div styleName='off'>OFF</div>
              <div styleName='on'>ON</div>
            </div>
          </div>
          <QuestionsForm questions={groupToGroupJoinQuestions} save={this.updateSettingDirectly('groupToGroupJoinQuestions')} disabled={!askGroupToGroupJoinQuestions} />
        </div>
      </SettingsSection>

      <div styleName='saveChanges'>
        <span styleName={changed ? 'settingChanged' : ''}>{changed ? 'Changes not saved' : 'Current settings up to date'}</span>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}

function VisibilitySettingRow ({ currentSetting, forSetting, updateSetting }) {
  return <div styleName={'privacySetting' + ' ' + cx({ on: currentSetting === forSetting })}>
    <label>
      <input type='radio' name='Visibility' value={forSetting} onChange={updateSetting('visibility')} checked={currentSetting === forSetting} />
      <Icon name={visibilityIcon(forSetting)} styleName='settingIcon' />
      <div styleName='settingDescription'>
        <h4>{visibilityString(forSetting)}</h4>
        <span styleName={cx('privacy-option', { disabled: currentSetting !== forSetting })}>{visibilityDescription(forSetting)}</span>
      </div>
    </label>
  </div>
}

function AccessibilitySettingRow ({ askJoinQuestions, clearField, currentSetting, forSetting, joinQuestions, updateJoinQuestion, updateSetting, updateSettingDirectly }) {
  return <div styleName={'privacySetting' + ' ' + cx({ on: currentSetting === forSetting })}>
    <label>
      <input type='radio' name='accessibility' value={forSetting} onChange={updateSetting('accessibility')} checked={currentSetting === forSetting} />
      <Icon name={accessibilityIcon(forSetting)} styleName='settingIcon' />
      <div styleName='settingDescription'>
        <h4>{accessibilityString(forSetting)}</h4>
        <span styleName={cx('privacy-option', { disabled: currentSetting !== forSetting })}>{accessibilityDescription(forSetting)}</span>
      </div>
    </label>
    {forSetting === currentSetting && currentSetting === GROUP_ACCESSIBILITY.Restricted &&
      <div styleName={'groupQuestions' + ' ' + cx({ on: askJoinQuestions })}>
        <div styleName='switchContainer'>
          <SwitchStyled
            checked={askJoinQuestions}
            onChange={() => updateSettingDirectly('settings.askJoinQuestions')(!askJoinQuestions)}
            backgroundColor={askJoinQuestions ? '#0DC39F' : '#8B96A4'} />
          <span styleName='toggleDescription'>Require people to answer questions when requesting to join this group</span>
          <div styleName='onOff'>
            <div styleName='off'>OFF</div>
            <div styleName='on'>ON</div>
          </div>
        </div>
        <QuestionsForm questions={joinQuestions} save={updateSettingDirectly('joinQuestions', true)} disabled={!askJoinQuestions} />
      </div>
    }
  </div>
}

function QuestionsForm ({ disabled, questions, save }) {
  const updateJoinQuestion = (index) => event => {
    const value = event.target.value
    const newQuestions = questions
    if (trim(value) === '') {
      newQuestions.splice(index, 1)
    } else if (newQuestions[index].text !== value) {
      newQuestions[index] = { text: value }
    }
    if (newQuestions[newQuestions.length - 1].text !== '') {
      newQuestions.push({ text: '' })
    }
    save(newQuestions)
  }

  const clearField = (index) => event => {
    event.target.value = ''
    updateJoinQuestion(index)(event)
  }

  return <div styleName='questionList'>
    {questions.map((q, i) => <div key={i} styleName='question'>
      {q.text ? <div styleName='deleteInput'><Icon name='CircleEx' styleName='close' onClick={clearField(i)} /></div> : <span styleName='createInput'>+</span>}
      <input name='questions[]' disabled={disabled} value={q.text} placeholder='Add a new question' onChange={updateJoinQuestion(i)} />
    </div>)}
  </div>
}
