import React, { PropTypes } from 'react'
import { get } from 'lodash/fp'
import cx from 'classnames'
import styles from './PostEditor.scss'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'
import HyloModal from 'components/HyloModal'

export default class PostEditor extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    initialPrompt: PropTypes.string,
    onClose: PropTypes.func,
    titlePlaceholder: PropTypes.string,
    detailsPlaceholder: PropTypes.string,
    communityOptions: PropTypes.array,
    post: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      details: PropTypes.string,
      communities: PropTypes.array
    }),
    createPost: PropTypes.func.isRequired
  }

  static defaultProps = {
    disabled: true,
    initialPrompt: 'What are you looking to post?',
    titlePlaceholderForPostType: {
      offer: 'What super powers can you offer?',
      default: 'What’s on your mind?'
    },
    detailsPlaceholder: 'Add a details',
    post: {
      type: 'discussion',
      title: '',
      details: '',
      communities: []
    }
  }

  buildStateFromProps = ({ post }) => {
    const defaultedPost = post || PostEditor.defaultProps.post
    return {
      post: defaultedPost,
      titlePlaceholder: this.titlePlaceholderForPostType(defaultedPost.type),
      valid: false
    }
  }

  constructor (props) {
    super(props)
    console.log(props)
    this.state = this.buildStateFromProps(props)
  }

  componentDidUpdate (prevProps) {
    if (get('post.id', this.props) !== get('post.id', prevProps)) {
      this.reset(this.props)
      this.editor.focus()
    }
  }

  reset = (props) => {
    this.editor.reset()
    this.communitiesSelector.reset()
    this.setState(this.buildStateFromProps(props))
  }

  handlePostTypeSelection = event => {
    const type = event.target.textContent.toLowerCase()
    this.setState({
      post: {...this.state.post, type},
      titlePlaceholder: this.titlePlaceholderForPostType(type),
      valid: this.isValid({ type })
    })
  }

  titlePlaceholderForPostType (type) {
    const { titlePlaceholderForPostType } = this.props
    return titlePlaceholderForPostType[type] || titlePlaceholderForPostType['default']
  }

  postTypeButtonProps = (forPostType) => {
    const { type } = this.state.post
    return {
      label: forPostType,
      onClick: this.handlePostTypeSelection,
      className: cx(
        styles['postType'],
        styles[`postType-${forPostType}`],
        {
          [styles[`postType-${forPostType}-active`]]: type === forPostType
        }
      )
    }
  }

  handleTitleChange = (event) => {
    const title = event.target.value
    this.setState({
      post: {...this.state.post, title},
      valid: this.isValid({ title })
    })
  }

  setSelectedCommunities = communities => {
    this.setState({
      post: {...this.state.post, communities},
      valid: this.isValid({ communities })
    })
  }

  isValid = (postUpdates = {}) => {
    const { type, title, communities } = Object.assign({}, this.state.post, postUpdates)
    return !!(this.editor &&
      communities &&
      type.length > 0 &&
      title.length > 0 &&
      !this.editor.isEmpty() &&
      communities.length > 0)
  }

  setValid = () =>
    this.setState({valid: this.isValid()})

  save = () => {
    const { createPost } = this.props
    const { type, title, communities } = this.state.post
    const details = this.editor.getContentHTML()
    const communityIds = communities.map(c => c.id)
    createPost({ type, title, details, communityIds })
      .then(this.reset(PostEditor.defaultProps))
  }

  render () {
    const { titlePlaceholder, valid, post } = this.state
    if (!post) return null
    const { title, details, communities } = post
    const { disabled, initialPrompt, detailsPlaceholder, communityOptions } = this.props
    const postEditor = <div styleName='wrapper' ref={element => { this.wrapper = element }}>
      <div styleName='header'>
        <div styleName='initial'>
          <div styleName='initial-prompt'>{initialPrompt}</div>
          <a styleName='initial-closeButton' onClick={this.modal && this.modal.closeModal}><Icon name='Ex' /></a>
        </div>
        <div styleName='postTypes'>
          <Button {...this.postTypeButtonProps('discussion')} />
          <Button {...this.postTypeButtonProps('request')} />
          <Button {...this.postTypeButtonProps('offer')} />
        </div>
      </div>
      <div styleName='body'>
        <div styleName='body-column'>
          <Avatar
            medium
            styleName='titleAvatar'
            url=''
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
          />
        </div>
        <div styleName='body-column'>
          <input
            type='text'
            styleName='titleInput'
            placeholder={titlePlaceholder}
            value={title}
            onChange={this.handleTitleChange}
          />
          <HyloEditor
            styleName='editor'
            placeholder={detailsPlaceholder}
            onChange={this.setValid}
            contentHTML={details}
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
        </div>
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>Post in</div>
          <div styleName='postIn-communities'>
            <CommunitiesSelector
              options={communityOptions}
              selected={communities}
              onChange={this.setSelectedCommunities}
              ref={component => { this.communitiesSelector = component }}
            />
          </div>
        </div>
        <div styleName='actionsBar'>
          <Button
            onClick={this.save}
            disabled={!valid}
            styleName='postButton'
            label='Post'
            color='green'
          />
        </div>
      </div>
    </div>

    return <HyloModal
      shouldCloseOnOverlayClick={false}
      refocusOnElement={this.editor}
      ref={component => { this.modal = component }}
    >
      {postEditor}
    </HyloModal>
  }
}
