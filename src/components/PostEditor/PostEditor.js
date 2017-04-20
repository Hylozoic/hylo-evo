import React, { PropTypes } from 'react'
import cx from 'classnames'
import styles from './PostEditor.scss'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'

export default class PostEditor extends React.Component {
  static propTypes = {
    titlePlaceholder: PropTypes.string,
    bodyPlaceholder: PropTypes.string,
    postType: PropTypes.string,
    currentUser: PropTypes.object,
    createPost: PropTypes.func
  }

  static defaultProps = {
    titlePlaceholders: {
      offer: 'What super powers can you offer?',
      default: 'What’s on your mind?'
    },
    bodyPlaceholder: 'Add a description',
    postType: 'discussion'
  }

  constructor (props) {
    super(props)
    this.state = {
      postType: props.postType,
      title: '',
      titlePlaceholder: this.titlePlaceholderForPostType(props.postType),
      description: '',
      selectedCommunities: []
    }
  }

  reset = () => {
    this.editor.reset()
    this.communitiesSelector.reset()
    this.setState({
      postType: this.props.postType,
      title: '',
      titlePlaceholder: this.titlePlaceholderForPostType(this.props.postType),
      description: '',
      selectedCommunities: []
    })
  }

  titlePlaceholderForPostType (postType) {
    const { titlePlaceholders } = this.props
    return titlePlaceholders[postType] || titlePlaceholders['default']
  }

  handlePostTypeSelection = postType => event => {
    this.setState({
      postType,
      titlePlaceholder: this.titlePlaceholderForPostType(postType)
    })
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

  handleTitleChange = (event) => this.setState({title: event.target.value})

  setSelectedCommunities = selectedCommunities => this.setState({ selectedCommunities })

  save = () => {
    const { createPost } = this.props
    const {
      postType,
      title,
      selectedCommunities
    } = this.state
    const description = this.editor.getContentHTML()
    const selectedCommunityIds = selectedCommunities.map(c => c.id)
    console.log(
      postType,
      title,
      description,
      selectedCommunityIds
    )
    createPost(
      title,
      description,
      selectedCommunityIds
    ).then(() => this.reset())
  }

  render () {
    const { bodyPlaceholder, communities } = this.props
    const { titlePlaceholder, title } = this.state

    return <div styleName='wrapper'>
      <div styleName='header'>
        <div styleName='initialPrompt'>What are you looking to post?</div>
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
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png' />
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
            placeholder={bodyPlaceholder}
            ref={component => { this.editor = component && component.getWrappedInstance() }}
          />
        </div>
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>Post in</div>
          <div styleName='postIn-communities'>
            <CommunitiesSelector
              options={communities}
              onChange={this.setSelectedCommunities}
              ref={component => { this.communitiesSelector = component }}
            />
          </div>
        </div>
        <div styleName='actionsBar'>
          <Button onClick={this.save} styleName='postButton' label='Post' color='green' />
        </div>
      </div>
    </div>
  }
}
