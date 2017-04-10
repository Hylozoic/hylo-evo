import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import { personUrl } from 'util/index'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import './Message.scss'

const { bool, object } = React.PropTypes

export default function Message ({ message, message: { fromTemp, image }, isHeader }) {
  const person = message.creator
  // const notPending = message.id.slice(0, 4) === 'post' ? null : true
  // <span className='date'>{notPending ? humanDate(message.created_at) : 'sending...'}</span>
  let text = present(sanitize(message.text).replace(/\n/g, '<br />'), {noP: true})
  const sName = cx('message', {messageHeader: isHeader})
  return <div styleName={sName}
    data-message-id={message.id}>
    <div styleName='avatar'>
      {isHeader && <Avatar url={personUrl(person)} avatarUrl={person.avatarUrl} />}
    </div>
    <div styleName='content'>
      {isHeader && <div>
        <span styleName='name'>{sanitize(person.name)}</span>
        <span styleName='date'>{humanDate(message.createdAt)}</span>
      </div>}
      <div styleName='text'>
        <span dangerouslySetInnerHTML={{__html: text}} />
      </div>
    </div>
  </div>
}
Message.propTypes = {
  message: object.isRequired,
  isHeader: bool
}
