import cx from 'classnames'
import { get, isFunction } from 'lodash/fp'
import PropTypes from 'prop-types'
import React from 'react'
import PeopleInfo from '../PeopleInfo'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { CURRENT_USER_PROP_TYPES } from 'store/models/Me'

import './PostFooter.scss'

export default class PostFooter extends React.PureComponent {
  static propTypes= {
    currentUser: PropTypes.shape(CURRENT_USER_PROP_TYPES),
    commenters: PropTypes.array,
    commentersTotal: PropTypes.number,
    constrained: PropTypes.bool,
    votesTotal: PropTypes.number,
    myVote: PropTypes.bool,
    voteOnPost: PropTypes.func.isRequired,
    onClick: PropTypes.func
  }

  render () {
    const {
      currentUser,
      commenters,
      commentersTotal,
      constrained,
      myVote,
      onClick,
      postId,
      votesTotal
    } = this.props
    const vote = isFunction(this.props.voteOnPost) ? () => this.props.voteOnPost() : undefined

    const tooltipId = 'postfooter-tt-' + postId

    return (
      <div styleName={cx('footer', { constrained })}>
        <PeopleInfo constrained={constrained} onClick={onClick} people={commenters} peopleTotal={commentersTotal} excludePersonId={get('id', currentUser)} />
        {currentUser
          ? (
            <a
              data-for={tooltipId}
              data-tip='Upvote this post so more people see it.'
              data-tip-disable={myVote}
              onClick={vote}
              styleName={cx('vote-button', { voted: myVote })}
            >
              <Icon name='ArrowUp' styleName='arrowIcon' />
              {votesTotal}
            </a>
            )
          : ''}
        <Tooltip
          delay={550}
          id={tooltipId}
        />
      </div>
    )
  }
}
