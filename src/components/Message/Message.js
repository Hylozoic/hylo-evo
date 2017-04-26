import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import { personUrl } from 'util/index'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import './Message.scss'

const { bool, object } = React.PropTypes

export default function Message ({ message, isHeader }) {
  const person = message.creator
  const pending = message.id.slice(0, 13) === 'messageThread'
  let text = present(sanitize(message.text).replace(/\n/g, '<br />'), {noP: true})
  const sName = cx('message', {messageHeader: isHeader})
  return <div styleName={sName}
    data-message-id={message.id}>
    <div styleName='avatar'>
      {isHeader && <Avatar url={personUrl(person.id)} avatarUrl={person.avatarUrl} />}
    </div>
    <div styleName='content'>
      {isHeader && <div>
        <span styleName='name'>{sanitize(person.name)}</span>
        <span styleName='date'>{pending ? 'sending...' : humanDate(message.createdAt)}</span>
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
