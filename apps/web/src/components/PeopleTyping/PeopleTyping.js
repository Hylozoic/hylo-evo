import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { each, values } from 'lodash'
import './PeopleTyping.scss'
const { string, object } = PropTypes

// the amount to delay before deciding that someone is no longer typing
const MAX_TYPING_PAUSE = 5000

class PeopleTyping extends React.Component {
  componentDidMount () {
    if (window) {
      this.interval = setInterval(this.resetTyping.bind(this), 500)
    }
  }

  resetTyping () {
    const { peopleTyping, clearUserTyping } = this.props
    const now = Date.now()
    each(peopleTyping, ({ timestamp }, id) =>
      now - timestamp > MAX_TYPING_PAUSE && clearUserTyping(id))
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval)
  }

  render () {
    const { className, peopleTyping } = this.props
    const names = values(peopleTyping).map(v => v.name)
    return <div styleName='typing' className={className}>
      {names.length === 1 && <div>
        {names[0]} {this.props.t('is typing...')}
      </div>}
      {names.length > 1 && <div>{this.props.t('Multiple people are typing...')}</div>}
      &nbsp;
    </div>
  }
}
PeopleTyping.propTypes = {
  className: string,
  peopleTyping: object
}

export default withTranslation()(PeopleTyping)
