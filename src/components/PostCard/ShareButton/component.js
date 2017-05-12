/* eslint-disable camelcase */
import React from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import './component.scss'

export default function ShareButton ({ post, className }) {
  return <Dropdown toggleChildren={<Icon name='Share' />}>
    <li><a onClick={() => console.log('clicked A')}>A</a></li>
    <li><a onClick={() => console.log('clicked List')}>List</a></li>
  </Dropdown>
}
