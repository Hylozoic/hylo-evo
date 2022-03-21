import React from 'react'
import { shallow } from 'enzyme'
import Signup from './Signup'

describe('Signup', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Signup />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with mobile redirect', () => {
    const url = 'some.url'
    const wrapper = shallow(<Signup downloadAppUrl={url} />)
    expect(wrapper).toMatchSnapshot()
  })
})

// From Connector for possible use/adaptation to component tests
// import { mapDispatchToProps, mapStateToProps } from './Signup.connector'

// describe('Signup', () => {
//   it('should call signup', () => {
//     expect(mapDispatchToProps.signup('name', 'test@hylo.com', 'testPassword')).toMatchSnapshot()
//   })
//   it('returns the right keys', () => {
//     expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('downloadAppUrl')).toBeTruthy()
//     expect(mapStateToProps({}, { location: { search: '' } }).hasOwnProperty('returnToURL')).toBeTruthy()
//     expect(mapStateToProps({ login: { error: 'no mojo' } }, { location: { search: '' } }).error).toEqual('no mojo')
//     expect(mapStateToProps({}, { location: { search: '?error=moo' } }).error).toEqual('moo')
//   })
// })
