import React, { PropTypes } from 'react'
import cx from 'classnames'
import styles from './PostEditor.scss'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'

export default class PostEditor extends React.Component {
  static propTypes = {
    initialPrompt: PropTypes.string,
    titlePlaceholder: PropTypes.string,
    descriptionPlaceholder: PropTypes.string,
    postType: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    communitiesSelected: PropTypes.array,
    communityOptions: PropTypes.array,
    createPost: PropTypes.func.isRequired
  }

  static defaultProps = {
    initialPrompt: 'What are you looking to post?',
    postType: 'discussion',
    title: '',
    titlePlaceholderForPostType: {
      offer: 'What super powers can you offer?',
      default: 'What’s on your mind?'
    },
    descriptionPlaceholder: 'Add a description',
    description: '',
    communitiesSelected: []
  }

  defaultState = ({
    postType, description, title, communitiesSelected
  }) => {
    return {
      postType,
      titlePlaceholder: this.titlePlaceholderForPostType(postType),
      title,
      description,
      communitiesSelected,
      valid: false
    }
  }

  constructor (props) {
    super(props)
    this.state = this.defaultState(props)
  }

  reset = () => {
    this.editor.reset()
    this.communitiesSelector.reset()
    this.setState(this.defaultState(this.props))
  }

  handlePostTypeSelection = postType => event => {
    this.setState({
      postType,
      titlePlaceholder: this.titlePlaceholderForPostType(postType),
      valid: this.isValid({ postType })
    })
  }

  titlePlaceholderForPostType (postType) {
    const { titlePlaceholderForPostType } = this.props
    return titlePlaceholderForPostType[postType] || titlePlaceholderForPostType['default']
  }

  postTypeButtonProps = type => {
    const { postType } = this.state
    return {
      label: type,
      onClick: this.handlePostTypeSelection(type),
      className: cx(
        styles.postType,
        styles[`postType-${type}`],
        {
          [styles[`postType-${type}-active`]]: postType === type
        }
      )
    }
  }

  handleTitleChange = (event) => {
    const title = event.target.value
    this.setState({
      title,
      valid: this.isValid({ title })
    })
  }

  setSelectedCommunities = communitiesSelected => {
    this.setState({
      communitiesSelected,
      valid: this.isValid({ communitiesSelected })
    })
  }

  isValid = (updates = {}) => {
    const { communitiesSelected, postType, title } = Object.assign({}, this.state, updates)
    return !!(this.editor &&
      communitiesSelected &&
      postType.length > 0 &&
      title.length > 0 &&
      !this.editor.isEmpty() &&
      communitiesSelected.length > 0)
  }

  setValid = () =>
    this.setState({valid: this.isValid()})

  save = () => {
    const { createPost } = this.props
    const { title, postType, communitiesSelected } = this.state
    const description = this.editor.getContentHTML()
    const selectedCommunityIds = communitiesSelected.map(c => c.id)
    createPost(title, description, selectedCommunityIds, postType).then(this.reset)
  }

  render () {
    const {
      initialPrompt, descriptionPlaceholder, description, communityOptions, communitiesSelected
    } = this.props
    const { titlePlaceholder, title, valid } = this.state

    return <div styleName='wrapper'>
      <div styleName='header'>
        <div styleName='initialPrompt'>{initialPrompt}</div>
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
            placeholder={descriptionPlaceholder}
            onChange={this.setValid}
            contentHTML={description}
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
              selected={communitiesSelected}
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
  }
}
