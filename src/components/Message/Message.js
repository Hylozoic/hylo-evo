import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import { personUrl } from 'util'
import { humanDate, present } from 'util/text'
import { sanitize } from 'hylo-utils/text'
import './Message.scss'

const { bool, object } = React.PropTypes

export default function Message ({ message, message: { fromTemp, image }, isHeader }) {
  const person = message.user
  // const notPending = message.id.slice(0, 4) === 'post' ? null : true
  let text = present(sanitize(message.text).replace(/\n/g, '<br />'), {noP: true})

  return <div className={cx('message', {messageHeader: isHeader})}
    data-message-id={message.id}>
    {isHeader && <Avatar url={personUrl(person)} avatarUrl={person.avatarUrl} small />}
    <div className='content'>
      {isHeader && <div>
        <strong className='name'>{sanitize(person.name)}</strong>
        // <span className='date'>{notPending ? humanDate(message.created_at) : 'sending...'}</span>
        <span className='date'>{humanDate(message.created_at)}</span>
      </div>}
      <div className='text'>
        <span dangerouslySetInnerHTML={{__html: text}} />
      </div>
    </div>
  </div>
}
Message.propTypes = {
  message: object.isRequired,
  isHeader: bool
}
