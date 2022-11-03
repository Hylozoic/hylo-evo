import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import './Message.scss'

export default function Message ({ message, isHeader }) {
  const person = message.creator
  const pending = message.id.slice(0, 13) === 'messageThread'
  // TODO: New line replacement is happening on both Web and Mobile
  //       This would probably be better handled as a markdown editor
  //       which sends HTML to API or an HTML editor (HyloEditor) in both places
  const text = pending
    ? 'sending...'
    : TextHelpers.markdown(message.text)
  const sName = cx('message', { messageHeader: isHeader })

  return (
    <div styleName={sName} data-message-id={message.id}>
      <div styleName='avatar'>
        {isHeader && <Avatar url={personUrl(person.id)} avatarUrl={person.avatarUrl} />}
      </div>
      <div styleName='content'>
        {isHeader && <div>
          <span styleName='name'>{person.name}</span>
          <span styleName='date'>{pending ? 'sending...' : TextHelpers.humanDate(message.createdAt)}</span>
        </div>}
        <div styleName='text'>
          <ClickCatcher groupSlug='all'>
            <HyloHTML element='span' html={text} />
          </ClickCatcher>
        </div>
      </div>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    creator: PropTypes.object
  }).isRequired,
  isHeader: PropTypes.bool
}
