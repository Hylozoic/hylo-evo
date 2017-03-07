import React from 'react'
import ReactDOM from 'react-dom'
import GeneralLayout from './component'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<GeneralLayout />, div)
})
