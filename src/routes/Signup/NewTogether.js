import React from 'react'
import NewComponent from './NewComponent'
import NewSidebar from './NewSidebar'
import './Signup.scss'

export default function NewTogether ({props}) {
  return <div styleName='flex-wrapper'>
    <NewSidebar />
    <NewComponent />
  </div>
}
