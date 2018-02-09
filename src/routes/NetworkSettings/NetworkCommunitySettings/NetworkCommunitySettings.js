import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Autocomplete from 'react-autocomplete'
import { isEmpty } from 'lodash/fp'
import PaginatedList from '../PaginatedList'
import '../NetworkSettings.scss'

const { any, array, bool, func, number, object } = PropTypes

export default class NetworkCommunitySettings extends Component {
  render () {
    const {
      isModerator,
      isAdmin,
      communitySlug,
      network
    } = this.props

    if (!network) return <Loading />

    return <div styleName='communities-tab'>
      NetworkCommunitySettings for community {communitySlug}
    </div>
  }
}
