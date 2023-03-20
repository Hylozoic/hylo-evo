import React from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import PeopleInfo from '../PeopleInfo'
import Tooltip from 'components/Tooltip'
import { CURRENT_USER_PROP_TYPES } from 'store/models/Me'

import './PostFooter.scss'

class PostFooter extends React.PureComponent {
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
      onClick,
      postId
    } = this.props

    const tooltipId = 'postfooter-tt-' + postId

    return (
      <div onClick={onClick} styleName={cx('footer', { constrained })}>
        <PeopleInfo constrained={constrained} people={commenters} peopleTotal={commentersTotal} excludePersonId={get('id', currentUser)} />
        <Tooltip
          delay={550}
          id={tooltipId}
        />
      </div>
    )
  }
}

export default withTranslation()(PostFooter)
