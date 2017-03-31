import React from 'react'
import './component.scss'
import PostLabel from 'components/PostLabel'
import Avatar from 'components/Avatar'
import HyloEditor from 'components/HyloEditor'
import Button from 'components/Button'

const TITLE_PLACEHOLDER = 'What’s on your mind?'
const BODY_PLACEHOLDER = 'Add a description'

export default class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: ''
    }
  }

  handleTitleChange = (event) => this.setState({title: event.target.value})

  render () {
    const { title } = this.state

    return <div styleName='wrapper'>
      <div styleName='body'>
        <div styleName='initialPrompt' className='bdy-lt-sm'>What are you looking to post?</div>
        <div styleName='postTypes'>
          <PostLabel type='discussion' styleName='postType postType-left' />
          <PostLabel type='request' styleName='postType' />
          <PostLabel type='offer' styleName='postType postType-right' />
        </div>
        <div styleName='title'>
          <Avatar medium
            styleName='title-avatar'
            url=''
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png' />
          <input type='text'
            styleName='title-input'
            placeholder={TITLE_PLACEHOLDER}
            value={title}
            onChange={this.handleTitleChange} />
        </div>
        <HyloEditor styleName='editor' debug placeholder={BODY_PLACEHOLDER} />
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>
            Post in
          </div>
          <div styleName='postIn-communities'>
            ...
          </div>
        </div>
        <div styleName='actionsBar'>
          <div styleName='actions'>
            ...
          </div>
          <Button styleName='postButton' label='Post' color='green' />
        </div>
      </div>
    </div>
  }
}
