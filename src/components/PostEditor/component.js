import React, { PropTypes } from 'react'
import './component.scss'
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
      title: ''
    }
  }

  handleTitleChange = (event) => this.setState({title: event.target.value})

  render () {
    const { titlePlaceholder, bodyPlaceholder } = this.props
    const { title } = this.state

    return <div styleName='wrapper'>
      <div styleName='body'>
        <div styleName='initialPrompt' className='bdy-lt-sm'>What are you looking to post?</div>
        <div styleName='postTypes'>
          <Button styleName='postType postType-discussion'>Discussion</Button>
          <Button styleName='postType postType-request'>Request</Button>
          <Button styleName='postType postType-offer'>Offer</Button>
        </div>
        <div styleName='title'>
          <Avatar medium
            styleName='title-avatar'
            url=''
            avatarUrl='https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png' />
          <input type='text'
            styleName='title-input'
            placeholder={titlePlaceholder}
            value={title}
            onChange={this.handleTitleChange} />
        </div>
        <HyloEditor styleName='editor' debug placeholder={bodyPlaceholder} />
      </div>
      <div styleName='footer'>
        <div styleName='postIn'>
          <div styleName='postIn-label'>
            Post in
          </div>
          <div styleName='postIn-communities'>
            <CommunitiesSelector />
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
