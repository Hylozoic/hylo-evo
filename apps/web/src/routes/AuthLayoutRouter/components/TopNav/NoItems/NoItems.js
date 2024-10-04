import React from 'react'
import { bgImageStyle } from 'util/index'
import classes from './NoItems.module.scss'

export default function NoItems ({ message }) {
  return (
    <div className={classes.noItems}>
      <h3>{message}</h3>
      <div className={classes.image} style={bgImageStyle('/assets/hey-axolotl.png')} />
    </div>
  )
}
