import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import { personUrl } from 'util/index'
// import { humanDate, present } from 'util/text'
// TODO: fix these two functions to be proper from import
const humanDate = (text) => text
const present = (text) => text
import { sanitize } from 'hylo-utils/text'
import './Message.scss'

const { bool, object } = React.PropTypes

export default function Message ({ message, message: { fromTemp, image }, isHeader }) {
  const person = message.creator
  // const notPending = message.id.slice(0, 4) === 'post' ? null : true
  // <span className='date'>{notPending ? humanDate(message.created_at) : 'sending...'}</span>
  let text = present(sanitize(message.text).replace(/\n/g, '<br />'), {noP: true})

  return <div className={cx('message', {messageHeader: isHeader})}
    data-message-id={message.id}>
    {isHeader && <Avatar url={personUrl(person)} avatarUrl={person.avatarUrl} small />}
    <div className='content'>
      {isHeader && <div>
        <strong className='name'>{sanitize(person.name)}</strong>
        <span className='date'>{humanDate(message.createdAt)}</span>
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
