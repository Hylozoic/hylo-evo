import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { set, trim } from 'lodash'
import cx from 'classnames'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import EditableMap from 'components/Map/EditableMap/EditableMap'
import PostLabel from 'components/PostLabel'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SwitchStyled from 'components/SwitchStyled'
import TopicSelector from 'components/TopicSelector'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  LOCATION_PRECISION
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import SettingsSection from '../SettingsSection'

import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './GroupSettingsTab.scss' // eslint-disable-line no-unused-vars
import EditableMapModal from 'components/Map/EditableMap/EditableMapModal'
import { sanitizeURL } from 'util/url'
import { POST_TYPES } from 'store/models/Post'

const emptyCustomView = {
  name: '',
  icon: 'Public',
  postTypes: [],
  activePostsOnly: false,
  externalLink: '',
  viewMode: 'externalLink',
  isActive: true,
  order: 1,
  topics: []
}

const CUSTOM_VIEW_TYPES = {
  externalLink: 'External Link',
  cards: 'Posts - Cards View',
  list: 'Posts - List View',
  grid: 'Posts - Grid View'
}

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

    if (!group) return { edits: {}, changed: false, valid: false }

    const {
      aboutVideoUri, avatarUrl, bannerUrl, customViews, description, geoShape, location, locationObject, name, settings
    } = group

    return {
      edits: {
        aboutVideoUri: (aboutVideoUri && trim(aboutVideoUri)) || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        description: description || '',
        geoShape: geoShape && typeof geoShape !== 'string' ? JSON.stringify(geoShape) || '' : geoShape || '',
        location: location || '',
        locationId: locationObject ? locationObject.id : '',
        moderatorDescriptor: group.moderatorDescriptor || 'Moderator',
        moderatorDescriptorPlural: group.moderatorDescriptorPlural || 'Moderators',
        name: name || '',
        settings: typeof settings !== 'undefined' ? settings : { },
        customViews: customViews || []
      },
      error: null,
      changed: false,
      isModal: false,
      postTypesModalOpen: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
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
      edits: { ...edits, geoShape: polygon ? JSON.stringify(polygon.geometry) : null }
    })
  }

  toggleModal = () => {
    this.setState({
      isModal: !this.state.isModal
    })
  }

  validate = () => {
    const { edits } = this.state

    let errorString = ''

    edits.customViews.forEach(cv => {
      const { externalLink, name, icon } = cv
      if (externalLink.length > 0) {
        if (!sanitizeURL(externalLink)) {
          errorString += 'External link has to be a valid URL. \n'
        }
      }

      if (name.length < 2) {
        errorString += 'View name needs to be at least two characters long. \n'
      }
      if (icon.length < 1) {
        errorString += 'An icon needs to be selected for ev view. '
      }
    })
    this.setState({ error: errorString })
  }

  save = async () => {
    this.setState({ changed: false })
    const { group, fetchLocation } = this.props
    let locationId = this.state.edits.locationId
    if (group && this.state.edits.location !== group.location) {
      locationId = await ensureLocationIdIfCoordinate({ fetchLocation, location: this.state.edits.location, locationId })
    }
    const customViews = this.state.edits.customViews.map(cv => {
      cv.topics = cv.topics.map(t => ({ name: t.name, id: t.id }))
      if (cv.externalLink) cv.externalLink = sanitizeURL(cv.externalLink)
      return cv
    })
    this.props.updateGroupSettings({ ...this.state.edits, locationId, customViews })
  }

  addCustomView = () => {
    this.setState({
      edits: { ...this.state.edits, customViews: [ ...this.state.edits.customViews ].concat({ ...emptyCustomView }) }
    })
  }

  deleteCustomView = (i) => () => {
    if (window.confirm('Are you sure you want to delete this custom view?')) {
      const newViews = [...this.state.edits.customViews]
      newViews.splice(i, 1)
      this.setState({
        changed: true,
        edits: { ...this.state.edits, customViews: newViews }
      }, () => {
        this.validate()
      })
    }
  }

  updateCustomView = (i) => (key) => (v) => {
    let value = typeof (v.target) !== 'undefined' ? v.target.value : v
    if (key === 'topics') {
      value = value.map(t => ({ name: t.name, id: parseInt(t.id) }))
    }
    let cv = { ...this.state.edits.customViews[i] }
    cv[key] = value
    let customViews = [ ...this.state.edits.customViews ]
    customViews[i] = cv
    this.setState({ changed: true, edits: { ...this.state.edits, customViews } }, () => {
      this.validate()
    })
  }

  saveButtonContent () {
    const { changed, error } = this.state
    if (!changed) return { color: 'gray', style: '', text: 'Current settings up to date' }
    if (error) {
      return { color: 'purple', style: 'general.settingIncorrect', text: error }
    }
    return { color: 'green', style: 'general.settingChanged', text: 'Changes not saved' }
  }

  render () {
    const { currentUser, group } = this.props
    if (!group) return <Loading />

    const { changed, edits, error } = this.state
    const {
      aboutVideoUri, avatarUrl, bannerUrl, customViews, description, geoShape, location, moderatorDescriptor, moderatorDescriptorPlural, name, settings
    } = edits

    const { locationDisplayPrecision, showSuggestedSkills } = settings
    const editableMapLocation = group?.locationObject || currentUser.locationObject

    return (
      <div styleName='general.groupSettings'>
        <input type='text' styleName='styles.name' onChange={this.updateSetting('name')} value={name || ''} />
        <div style={bgImageStyle(bannerUrl)} styleName='styles.banner'>
          <UploadAttachmentButton
            type='groupBanner'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
            styleName='styles.change-banner-button'
          />
        </div>
        <div style={bgImageStyle(avatarUrl)} styleName='styles.avatar'>
          <UploadAttachmentButton
            type='groupAvatar'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
            styleName='styles.change-avatar-button'
          />
        </div>
        <SettingsControl label='Description' onChange={this.updateSetting('description')} value={description} type='textarea' />
        <SettingsControl label='About Video URL' onChange={this.updateSetting('aboutVideoUri')} value={aboutVideoUri} />
        <SettingsControl
          label='Location'
          onChange={this.updateSettingDirectly('location', true)}
          location={location}
          locationObject={group.locationObject}
          type='location'
        />
        <label styleName='styles.label'>Location Privacy:</label>
        <Dropdown
          styleName='styles.location-obfuscation-dropdown'
          toggleChildren={<span styleName='styles.location-obfuscation-dropdown-label'>
            {LOCATION_PRECISION[locationDisplayPrecision || 'precise']}
            <Icon name='ArrowDown' />
          </span>}

          items={Object.keys(LOCATION_PRECISION).map(value => ({
            label: LOCATION_PRECISION[value],
            onClick: () => this.updateSettingDirectly('settings.locationDisplayPrecision')(value)
          }))}
        />
        <p styleName='general.detailText'>Note: as a moderator you will always see the exact location displayed</p>

        <br />

        <SettingsControl
          label='Word used to describe a group Moderator'
          onChange={this.updateSetting('moderatorDescriptor')}
          value={moderatorDescriptor}
        />

        <SettingsControl
          label='Plural word used to describe group Moderators'
          onChange={this.updateSetting('moderatorDescriptorPlural')}
          value={moderatorDescriptorPlural}
        />

        <br />

        <SettingsSection>
          <h3>Relevant skills &amp; interests</h3>
          <p styleName='general.detailText'>What skills and interests are particularly relevant to this group?</p>
          <div styleName={'styles.skillsSetting' + ' ' + cx({ 'general.on': showSuggestedSkills })}>
            <div styleName='general.switchContainer'>
              <SwitchStyled
                checked={showSuggestedSkills}
                onChange={() => this.updateSettingDirectly('settings.showSuggestedSkills')(!showSuggestedSkills)}
                backgroundColor={showSuggestedSkills ? '#0DC39F' : '#8B96A4'} />
              <span styleName='general.toggleDescription'>Ask new members whether they have these skills and interests?</span>
              <div styleName='general.onOff'>
                <div styleName='general.off'>OFF</div>
                <div styleName='general.on'>ON</div>
              </div>
            </div>
          </div>
          <SkillsSection
            group={group}
            label='Add a relevant skill or interest'
            placeholder='What skills and interests are most relevant to your group?' />
        </SettingsSection>
        <SettingsSection>
          <h3>Custom Views</h3>
          <div styleName='styles.help-text'>Add custom links or filtered post views to your group's navigation</div>
          {customViews.map((cv, i) => <CustomViewRow group={group} key={i} index={i} {...cv} onChange={this.updateCustomView(i)} onDelete={this.deleteCustomView(i)} />)}
          <div styleName='styles.add-custom-view' onClick={this.addCustomView}>
            <h4>Create new custom view</h4>
            <Icon name='Circle-Plus' styleName='styles.new-custom-view' />
          </div>
        </SettingsSection>

        <br />

        <SettingsControl
          label='What area does your group cover?'
          onChange={this.updateSetting('geoShape')}
          placeholder='For place based groups, draw the area where your group is active (or paste in GeoJSON here)'
          type='text'
          value={geoShape || ''}
        />
        <div styleName='styles.editable-map-container'>
          { this.state.isModal
            ? <EditableMapModal group={group} toggleModal={this.toggleModal}>
              <EditableMap
                locationObject={editableMapLocation}
                polygon={geoShape}
                savePolygon={this.savePolygon}
                toggleModal={this.toggleModal}
              />
            </EditableMapModal>
            : <EditableMap
              locationObject={editableMapLocation}
              polygon={geoShape}
              savePolygon={this.savePolygon}
              toggleModal={this.toggleModal}
            /> }
        </div>
        <br />

        <div styleName='general.saveChanges'>
          <span styleName={this.saveButtonContent().style}>{this.saveButtonContent().text}</span>
          <Button label='Save Changes' color={this.saveButtonContent().color} onClick={changed && !error ? this.save : null} styleName='general.save-button' />
        </div>
      </div>
    )
  }
}

function CustomViewRow ({ group, index, name, icon, externalLink, postTypes, viewMode, activePostsOnly, isActive, onChange, onDelete, topics }) {
  const [postTypesModalOpen, setPostTypesModalOpen] = useState(false)

  const togglePostType = (type, checked) => {
    let newPostTypes = [ ...postTypes ]
    if (checked) {
      newPostTypes = newPostTypes.concat(type)
    } else {
      newPostTypes = newPostTypes.filter(p => p !== type)
    }
    onChange('postTypes')(newPostTypes)
  }

  return (
    <div styleName='styles.custom-view-container'>
      <h4>
        <div><strong>Custom View #{parseInt(index) + 1}</strong>{name}</div>
        <Icon name='Trash' onClick={onDelete} />
      </h4>
      <div styleName='styles.custom-view-row'>
        <SettingsControl label='Icon' controlClass={styles['icon-button']} onChange={onChange('icon')} value={icon} type='icon-selector' selectedIconClass={styles.selectedIcon} />
        <SettingsControl label='Label' controlClass={styles['custom-view-label']} onChange={onChange('name')} value={name} />
      </div>
      <div styleName='styles.custom-view-row'>
        <label styleName='styles.label'>Custom View Type</label>
        <Dropdown
          styleName='styles.location-obfuscation-dropdown'
          toggleChildren={
            <span styleName='styles.location-obfuscation-dropdown-label'>
              {CUSTOM_VIEW_TYPES[viewMode || 'externalLink']}
              <Icon name='ArrowDown' />
            </span>
          }
          items={Object.keys(CUSTOM_VIEW_TYPES).map(value => ({
            label: CUSTOM_VIEW_TYPES[value],
            onClick: () => onChange('viewMode')(value)
          }))}
        />
      </div>
      {viewMode === 'externalLink' ? (
        <div>
          <SettingsControl label='External link' onChange={onChange('externalLink')} value={externalLink || ''} placeholder='Will open this URL in a new tab' />
          {externalLink && !sanitizeURL(externalLink) && <div styleName='styles.warning'>Must be a valid URL!</div>}
        </div>)
        : <div styleName={cx('styles.custom-posts-view')}>
          <div styleName='styles.post-types styles.custom-view-row'>
            <label styleName='styles.label'>What post types to display?</label>
            <div styleName='styles.post-types-chosen'>
              <span onClick={() => setPostTypesModalOpen(!postTypesModalOpen)}>
                {postTypes.length === 0 ? 'None' : postTypes.map((p, i) => <PostLabel key={p} type={p} styleName='styles.post-type' />)}
              </span>
              <div styleName={cx('styles.post-types-selector', { 'styles.open': postTypesModalOpen })}>
                <Icon name='Ex' styleName='styles.close-button' onClick={() => setPostTypesModalOpen(!postTypesModalOpen)} />
                {Object.keys(POST_TYPES).map(postType => {
                  const color = POST_TYPES[postType].primaryColor
                  return (
                    <div
                      key={postType}
                      styleName='styles.post-type-switch'
                    >
                      <SwitchStyled
                        backgroundColor={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`}
                        name={postType}
                        checked={postTypes.includes(postType)}
                        onChange={(checked, name) => togglePostType(postType, !checked)}
                      />
                      <span>{postType.charAt(0).toUpperCase() + postType.slice(1)}s</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div styleName='styles.custom-view-row'>
            <label styleName='styles.label'>Include only active posts?</label>
            <SwitchStyled
              checked={activePostsOnly}
              onChange={() => onChange('activePostsOnly')(!activePostsOnly)}
              backgroundColor={activePostsOnly ? '#0DC39F' : '#8B96A4'}
            />
          </div>
          <div styleName='styles.custom-view-last-row'>
            <label styleName='styles.label'>Include only posts that match any of these topics:</label>
            <TopicSelector currentGroup={group} selectedTopics={topics} onChange={onChange('topics')} />
          </div>
        </div>
      }
    </div>
  )
}
