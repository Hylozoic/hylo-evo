import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import classes from './Message.module.scss'

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
    <div className={cx(classes.message, { [classes.messageHeader]: isHeader })} data-message-id={message.id}>
      <div className={classes.avatar}>
        {isHeader && <Avatar url={personUrl(person.id)} avatarUrl={person.avatarUrl} />}
      </div>
      <div className={classes.content}>
        {isHeader && <div>
          <span className={classes.name}>{person.name}</span>
          <span className={classes.date}>{pending ? 'sending...' : TextHelpers.humanDate(message.createdAt)}</span>
        </div>}
        <div className={classes.text}>
          <ClickCatcher>
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
