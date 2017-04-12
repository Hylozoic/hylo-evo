import NavigationHandler from './NavigationHandler'
import { mount } from 'enzyme'
import React, { PropTypes } from 'react'

it('adds the navigate method to context', () => {
  const history = {
    push: to => `pushed to ${to}`
  }

  const Tester = jest.fn((props, context) => {
    expect(context.navigate).toBeTruthy()
    expect(context.navigate('x')).toEqual('pushed to x')
    return null
  })
  Tester.contextTypes = {navigate: PropTypes.func}

  // must use `mount`; `shallow` doesn't set up context
  mount(<NavigationHandler history={history}>
    <Tester />
  </NavigationHandler>)
  expect(Tester).toHaveBeenCalled()
})
