import AccountSettings, { Control, SocialControl } from './AccountSettings'
import { shallow } from 'enzyme'
import React from 'react'
import Promise from 'bluebird'


describe('AccountSettings', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AccountSettings currentUser={{}} />)
    expect(wrapper.find('Connect(ChangeImageButton)').length).toEqual(2)
    expect(wrapper.find('Control').length).toEqual(5)
    expect(wrapper.find('SocialControl').length).toEqual(3)
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({changed: true})
    expect(wrapper.find('Button').prop('color')).toEqual('green')
  })
})

describe('Control', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Control label='A Control' value='the value' />)
    expect(wrapper.find('label').text()).toEqual('A Control')
    expect(wrapper.find('input').prop('value')).toEqual('the value')
  })
})

describe('SocialControl', () => {

  global.Promise = Promise

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000


  it('renders correctly without a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' />)
    expect(wrapper.text()).toEqual('A Social ControlLink')
  })

  it('renders correctly with a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' value='someurl.com' />)
    expect(wrapper.text()).toEqual('A Social ControlUnlink')
  })

  it('calls onChange with true when link is clicked and onLink gives no error', done => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    const onChange = jest.fn()
    const onLink = jest.fn().mockImplementation(() => Promise.resolve({}))
    const wrapper = shallow(<SocialControl
      label='A Social Control' onChange={onChange} onLink={onLink} />)
    console.log(wrapper.debug())
    console.log('test 1')
    wrapper.find('span').simulate('click')
    console.log('test 2')
    expect(onLink).toHaveBeenCalled()
    console.log('test 3')
    setTimeout(() => {
      expect(onChange).toHaveBeenCalledWith('banana')
      console.log('test 5')
      done()
      console.log('test 6')
    }, 50)
    console.log('test 4')
  }, 10000)
})
