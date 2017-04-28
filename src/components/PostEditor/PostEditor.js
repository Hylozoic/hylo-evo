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
    post: PropTypes.object,
    currentUser: PropTypes.object,
    createPost: PropTypes.func
  }

  static defaultProps = {
    titlePlaceholders: {
      offer: 'What super powers can you offer?',
      default: 'What’s on your mind?'
    },
    bodyPlaceholder: 'Add a description',
    postType: 'discussion',
    post: {
      description: `This is a test <a href="/u/1" data-user-id="99" data-entity-type="mention">Loren Johnson</a> and the remaining text <a data-entity-type="hashtag">#test</a> text betweeen hastags <a data-entity-type="hashtag">#test2</a>`
    }
  }

  defaultState = ({ postType }) => {
    return {
      postType: postType,
      title: '',
      titlePlaceholder: this.titlePlaceholderForPostType(postType),
      selectedCommunities: [],
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

  titlePlaceholderForPostType (postType) {
    const { titlePlaceholders } = this.props
    return titlePlaceholders[postType] || titlePlaceholders['default']
  }

  handlePostTypeSelection = postType => event => {
    this.setState({
      postType,
      titlePlaceholder: this.titlePlaceholderForPostType(postType),
      valid: this.isValid({ postType })
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

  handleTitleChange = (event) => {
    const title = event.target.value
    this.setState({
      title,
      valid: this.isValid({ title })
    })
  }

  setSelectedCommunities = selectedCommunities => {
    this.setState({
      selectedCommunities,
      valid: this.isValid({ selectedCommunities })
    })
  }

  isValid = (updates = {}) => {
    const { selectedCommunities, postType, title } = Object.assign({}, this.state, updates)
    return !!(this.editor &&
      selectedCommunities &&
      postType.length > 0 &&
      title.length > 0 &&
      !this.editor.isEmpty() &&
      selectedCommunities.length > 0)
  }

  setValid = () =>
    this.setState({valid: this.isValid()})

  save = () => {
    const { createPost } = this.props
    const { title, postType, selectedCommunities } = this.state
    const description = this.editor.getContentHTML()
    console.log('save description in PostEditor', description)
    const selectedCommunityIds = selectedCommunities.map(c => c.id)
    createPost(title, description, selectedCommunityIds, postType).then(this.reset)
  }

  render () {
    const { bodyPlaceholder, communities, post } = this.props
    const { titlePlaceholder, title, valid } = this.state

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
            placeholder={bodyPlaceholder}
            onChange={this.setValid}
            contentHTML={post.description}
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
