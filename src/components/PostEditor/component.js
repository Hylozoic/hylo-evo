import React, { PropTypes } from 'react'
import cx from 'classnames'
import styles from './component.scss'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'
import CommunitiesSelector from 'components/CommunitiesSelector'

const TITLE_PLACEHOLDER = 'What’s on your mind?'
const BODY_PLACEHOLDER = 'Add a description'

export default class PostEditor extends React.Component {
  static propTypes = {
    titlePlaceholder: PropTypes.string,
    bodyPlaceholder: PropTypes.string
  }

  static defaultProps = {
    titlePlaceholder: TITLE_PLACEHOLDER,
    bodyPlaceholder: BODY_PLACEHOLDER
  }

  constructor (props) {
    super(props)
    this.state = {
      title: '',
      postType: 'discussion'
    }
  }

  handleTitleChange = (event) => this.setState({title: event.target.value})

  handlePostTypeSelection = type => event => this.setState({postType: type})

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

  save = () => {
    const { postType } = this.state
    return {
      postType
    }
  }

  render () {
    const { titlePlaceholder, bodyPlaceholder } = this.props
    const { title } = this.state

    return <div styleName='wrapper'>
      <div styleName='body'>
        <div styleName='initialPrompt'>What are you looking to post?</div>
        <div styleName='postTypes'>
          <Button {...this.postTypeButtonProps('discussion')} />
          <Button {...this.postTypeButtonProps('request')} />
          <Button {...this.postTypeButtonProps('offer')} />
        </div>
        <div styleName='title'>
          <Avatar
            medium
            styleName='title-avatar'
            url=''
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png' />
          <input
            type='text'
            styleName='title-input'
            placeholder={titlePlaceholder}
            value={title}
            onChange={this.handleTitleChange} />
        </div>
        <HyloEditor styleName='editor' placeholder={bodyPlaceholder} />
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>Post in</div>
          <div styleName='postIn-communities'>
            <CommunitiesSelector />
          </div>
        </div>
        <div styleName='actionsBar'>
          <div styleName='actions' />
          <Button onClick={this.save} styleName='postButton' label='Post' color='green' />
        </div>
      </div>
    </div>
  }
}
