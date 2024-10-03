import React from 'react'
import classes from './SettingsSection.module.scss'

const SettingsSection = ({ children }) => (
  <div className={classes.section}>
    {children}
  </div>
)

export default SettingsSection
