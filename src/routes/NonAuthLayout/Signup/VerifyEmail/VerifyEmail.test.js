import React from 'react'
import { shallow } from 'enzyme'
import VerifyEmail from './VerifyEmail'

describe('VerifyEmail', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<VerifyEmail email='test@wheee.com' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an error', () => {
    const wrapper = shallow(<VerifyEmail email='test@wheee.com' error='some error' />)
    expect(wrapper).toMatchSnapshot()
  })
})

// Maybe something here to preserve in component?
// import { mapDispatchToProps, mapStateToProps } from './VerifyEmail.connector'

// describe('VerifyEmail.connector', () => {
//   it('should call verifyEmail', () => {
//     expect(mapDispatchToProps.verifyEmail('test@hylo.com', 'acode')).toMatchSnapshot()
//   })

//   it('returns the right keys', () => {
//     expect(mapStateToProps({}, { location: { search: '?email=test@hylo.com' } }).email).toEqual('test@hylo.com')
//     expect(mapStateToProps({ login: { error: 'errrr' } }, { location: { search: '?email=test@hylo.com' } }).error).toEqual('errrr')
//   })
// })
