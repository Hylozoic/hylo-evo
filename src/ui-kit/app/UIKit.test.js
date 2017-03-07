import React from 'react'
import ReactDOM from 'react-dom'
import UIKit from './UIKit'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<UIKit />, div)
})
