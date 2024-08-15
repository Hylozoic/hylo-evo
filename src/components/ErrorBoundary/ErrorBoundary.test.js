import ErrorBoundary from './ErrorBoundary'
import { mount } from 'enzyme'
import React from 'react'

const Something = () => null

it('renders children correctly', () => {
  const wrapper = mount(
    <ErrorBoundary message='An Error Message'>
      <Something />
    </ErrorBoundary>
  )
  expect(wrapper).toMatchSnapshot()
})

it('renders an error when an error is thrown', () => {
  const wrapper = mount(
    <ErrorBoundary message='An Error Message'>
      <Something />
    </ErrorBoundary>
  )
  wrapper.setState({ hasError: true })
  // * Alternative:
  // It's a bit more pentrating, but a little more noisy in output:
  // const error = new Error('** An expected error to demonstrtate ErrorBoundary **')
  // wrapper.find(Something).simulateError(error)

  expect(wrapper).toMatchSnapshot()
})
