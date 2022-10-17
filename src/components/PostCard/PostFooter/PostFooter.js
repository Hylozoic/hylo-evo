import cx from 'classnames'
import { find, get, isFunction } from 'lodash/fp'
import PropTypes from 'prop-types'
import React from 'react'
import PeopleInfo from '../PeopleInfo'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import Tooltip from 'components/Tooltip'
import { CURRENT_USER_PROP_TYPES } from 'store/models/Me'

import './PostFooter.scss'

export default class PostFooter extends React.PureComponent {
  static propTypes= {
    currentUser: PropTypes.shape(CURRENT_USER_PROP_TYPES),
    commenters: PropTypes.array,
    commentersTotal: PropTypes.number,
    constrained: PropTypes.bool

  }

  render () {
    const {
      currentUser,
      commenters,
      commentersTotal,
      constrained,
      postId
    } = this.props

    const tooltipId = 'postfooter-tt-' + postId

    return (
      <div styleName={cx('footer', { constrained })}>
        <PeopleInfo constrained={constrained} people={commenters} peopleTotal={commentersTotal} excludePersonId={get('id', currentUser)} />
        <Tooltip
          delay={550}
          id={tooltipId}
        />
      </div>
    )
  }
}
