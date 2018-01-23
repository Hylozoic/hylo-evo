import ErrorBoundary from './ErrorBoundary'
import { mount } from 'enzyme'
import React from 'react'

it('renders children correctly', () => {
  const wrapper = mount(<ErrorBoundary message='An Error Message'><FailingChild /></ErrorBoundary>)
  expect(wrapper).toMatchSnapshot()
})

it('renders an error when an error is thrown', () => {
  const wrapper = mount(<ErrorBoundary message='An Error Message'><FailingChild throwError /></ErrorBoundary>)
  expect(wrapper).toMatchSnapshot()
})

function FailingChild ({throwError = false}) {
  if (throwError) {
    throw new Error('my error')
  }

  return <div>A Child</div>
}
