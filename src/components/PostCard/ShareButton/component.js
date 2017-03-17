/* eslint-disable camelcase */
import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import PostLabel from 'components/PostLabel'
import RoundImage from 'components/RoundImage'
import { personUrl, bgImageStyle } from 'utils'
const { shape, any, object, string, array } = React.PropTypes
import CSSModules from 'react-css-modules'
import styles from './component.scss'

export default function ShareButton ({ post, className }) {
  return <a onClick={() => console.log('Open Dropdown, post id', post.id)} styleName='link'>
    <Icon name='Share' />
  </a>
}
