import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import PostLabel from 'components/PostLabel'
import PostSelector from 'components/PostSelector'
import SettingsControl from 'components/SettingsControl'
import SwitchStyled from 'components/SwitchStyled'
import TopicSelector from 'components/TopicSelector'
import { POST_TYPES } from 'store/models/Post'
import { STREAM_SORT_OPTIONS } from 'util/constants'
import { sanitizeURL } from 'util/url'
import SettingsSection from '../SettingsSection'

import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './CustomViewsTab.scss' // eslint-disable-line no-unused-vars

const emptyCustomView = {
  activePostsOnly: false,
  collection: null,
  defaultSort: 'created',
  defaultViewMode: 'cards',
  externalLink: '',
  icon: 'Public',
  isActive: true,
  name: '',
  order: 1,
  postTypes: [],
  topics: [],
  type: 'externalLink'
}

const VIEW_TYPES = {
  externalLink: 'External Link',
  stream: 'Post Stream',
  collection: 'Post Collection'
}

const VIEW_MODES = {
  cards: 'Cards',
  list: 'List',
  bigGrid: 'Big Grid',
  grid: 'Small Grid'
}

const { object } = PropTypes

export default class CustomViewsTab extends Component {
  static propTypes = {
    group: object
  }

  constructor (props) {
    super(props)
    this.state = this.defaultEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setState(this.defaultEditState())

      const collectionCustomViews = (this.props.group?.customViews || []).filter(c => c.type === 'collection' && c.collectionId)
      collectionCustomViews.forEach(cv => {
        this.props.fetchCollectionPosts(this.props.group.id)
      })
    }
  }

  defaultEditState () {
    const { group } = this.props

    if (!group) return { customViews: [], changed: false, valid: false }

    const {
      customViews
    } = group

    return {
      customViews: customViews || [],
      error: null,
      changed: false,
      postTypesModalOpen: false
    }
  }

  validate = () => {
    const { customViews } = this.state

    let errorString = ''

    customViews.forEach(cv => {
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
        errorString += 'An icon needs to be selected for the view. '
      }
    })
    this.setState({ error: errorString })
  }

  save = async () => {
    this.setState({ changed: false })
    const customViews = this.state.customViews.map(cv => {
      cv.topics = cv.topics.map(t => ({ name: t.name, id: t.id }))
      if (cv.externalLink) cv.externalLink = sanitizeURL(cv.externalLink)
      return cv
    })
    this.props.updateGroupSettings({ customViews })
  }

  addCustomView = () => {
    this.setState({
      customViews: [ ...this.state.customViews ].concat({ ...emptyCustomView })
    })
  }

  deleteCustomView = (i) => () => {
    if (window.confirm('Are you sure you want to delete this custom view?')) {
      const newViews = [...this.state.customViews]
      newViews.splice(i, 1)
      this.setState({
        changed: true,
        customViews: newViews
      }, () => {
        this.validate()
      })
    }
  }

  updateCustomView = (i) => (key) => (v) => {
    let value = typeof (v.target) !== 'undefined' ? v.target.value : v
    let cv = { ...this.state.customViews[i] }

    if (key === 'topics') {
      value = value.map(t => ({ name: t.name, id: parseInt(t.id) }))
    }

    if (key === 'type' && value === 'collection' && cv.type !== 'collection') {
      if (cv.collection) {
        this.props.fetchCollectionPosts(cv.collection.id)
      } else {
        this.props.createCollection({ name: cv.name, groupId: this.props.group.id }).then((resp) => {
          this.updateCustomView(i)('collectionId')(resp?.payload?.data?.createCollection?.id)
        })
      }
    }

    cv[key] = value
    let customViews = [ ...this.state.customViews ]
    customViews[i] = cv
    this.setState({ changed: true, customViews }, () => {
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
    const { addPostToCollection, group, removePostFromCollection, reorderPostInCollection } = this.props
    if (!group) return <Loading />

    const { changed, customViews, error } = this.state

    return (
      <div styleName='general.groupSettings'>
        <SettingsSection>
          <h3>Custom Views</h3>
          <div styleName='styles.help-text'>Add custom links or filtered post views to your group's navigation</div>
          {customViews.map((cv, i) => (
            <CustomViewRow
              addPostToCollection={addPostToCollection}
              group={group}
              key={i}
              index={i}
              {...cv}
              onChange={this.updateCustomView(i)}
              onDelete={this.deleteCustomView(i)}
              removePostFromCollection={removePostFromCollection}
              reorderPostInCollection={reorderPostInCollection}
            />
          ))}
          <div styleName='styles.add-custom-view' onClick={this.addCustomView}>
            <h4>Create new custom view</h4>
            <Icon name='Circle-Plus' styleName='styles.new-custom-view' />
          </div>
        </SettingsSection>

        <br />

        <div styleName='general.saveChanges'>
          <span styleName={this.saveButtonContent().style}>{this.saveButtonContent().text}</span>
          <Button label='Save Changes' color={this.saveButtonContent().color} onClick={changed && !error ? this.save : null} styleName='general.save-button' />
        </div>
      </div>
    )
  }
}

function CustomViewRow ({
  activePostsOnly,
  addPostToCollection,
  collection,
  collectionId,
  defaultSort,
  defaultViewMode,
  externalLink,
  group,
  icon,
  index,
  name,
  onChange,
  onDelete,
  postTypes,
  removePostFromCollection,
  reorderPostInCollection,
  topics,
  type
}) {
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

  const removePost = (p) => {
    removePostFromCollection(collectionId, p.id)
  }

  const reorderPost = (p, i) => {
    reorderPostInCollection(collectionId, p.id, i)
  }

  const selectPost = (p) => {
    addPostToCollection(collectionId, p.id)
  }

  // needed because of external links which have empty default_view_mode or old 'externalLink' value
  const defaultViewModeVal = !defaultViewMode || defaultViewMode === 'externalLink' ? 'cards' : defaultViewMode

  const defaultSortVal = defaultSort || 'created'

  return (
    <div styleName='styles.custom-view-container'>
      <h4>
        <div><strong>Custom View #{parseInt(index) + 1}</strong>{name}</div>
        <Icon name='Trash' onClick={onDelete} />
      </h4>
      <div styleName='styles.custom-view-row'>
        <SettingsControl label='Icon' controlClass={styles['icon-button']} onChange={onChange('icon')} value={icon} type='icon-selector' selectedIconClass={styles.selectedIcon} />
        <SettingsControl label='Label' controlClass={styles['settings-control']} onChange={onChange('name')} value={name} />
        <SettingsControl label='Type' controlClass={styles['settings-control']} renderControl={(props) => {
          return <Dropdown
            styleName='styles.dropdown'
            toggleChildren={
              <span styleName='styles.dropdown-label'>
                {VIEW_TYPES[type || 'externalLink']}
                <Icon name='ArrowDown' />
              </span>
            }
            items={Object.keys(VIEW_TYPES).map(value => ({
              label: VIEW_TYPES[value],
              onClick: () => onChange('type')(value)
            }))}
          />
        }}
        />
      </div>
      {type === 'externalLink' ? (
        <div>
          <SettingsControl label='External link' onChange={onChange('externalLink')} value={externalLink || ''} placeholder='Will open this URL in a new tab' />
          {externalLink && !sanitizeURL(externalLink) && <div styleName='styles.warning'>Must be a valid URL!</div>}
        </div>)
        : (
          <div styleName={cx('styles.custom-posts-view')}>
            <div styleName='styles.custom-view-row'>
              <SettingsControl label='Default Style' controlClass={styles['settings-control']} renderControl={(props) => {
                return <Dropdown
                  styleName='styles.dropdown'
                  toggleChildren={
                    <span styleName='styles.dropdown-label'>
                      {VIEW_MODES[defaultViewModeVal || 'cards']}
                      <Icon name='ArrowDown' />
                    </span>
                  }
                  items={Object.keys(VIEW_MODES).map(value => ({
                    label: VIEW_MODES[value],
                    onClick: () => onChange('defaultViewMode')(value)
                  }))}
                />
              }} />
              <SettingsControl label='Default Sort' controlClass={styles['settings-control']} renderControl={(props) => {
                return <Dropdown
                  styleName='styles.dropdown'
                  toggleChildren={
                    <span styleName='styles.dropdown-label'>
                      {STREAM_SORT_OPTIONS.find(o => o.id === defaultSortVal).label}
                      <Icon name='ArrowDown' />
                    </span>
                  }
                  items={STREAM_SORT_OPTIONS.map(({ id, label }) => ({
                    label: label,
                    onClick: () => onChange('defaultSort')(id)
                  }))}
                />
              }} />
            </div>
            {type === 'stream' ? (
              <>
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
              </>) : (
              <>
                <div styleName='styles.post-types'>
                  <label styleName='styles.label'>Included Posts <span>{collection?.posts?.length || 0}</span></label>
                  <PostSelector
                    collection={collection}
                    group={group}
                    onRemovePost={removePost}
                    onReorderPost={reorderPost}
                    onSelectPost={selectPost}
                    posts={collection?.posts}
                  />
                </div>
              </>
            )}
          </div>
        )
      }
    </div>
  )
}
