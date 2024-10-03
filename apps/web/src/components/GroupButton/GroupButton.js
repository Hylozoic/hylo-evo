import React from 'react'
import { groupUrl } from 'util/navigation'
import { DEFAULT_AVATAR } from 'store/models/Group'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import RoundImage from 'components/RoundImage'
import classes from './GroupButton.module.scss'

export default ({ group }) => (
  <Button className={classes.button} small color='green-white'>
    <Link to={groupUrl(group.slug)}>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} small /> {group.name}
    </Link>
  </Button>
)
