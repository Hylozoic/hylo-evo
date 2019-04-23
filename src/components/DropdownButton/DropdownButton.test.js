import DropdownButton from './DropdownButton'
import { shallow } from 'enzyme'
import React from 'react'

describe('DropdownButton', () => {
  it('renders correctly and basic functions work', () => {
    const props = {
      label: 'Log in',
      choices: [{ label: 'one', value: 1 }, { label: 'two', value: 2 }],
      className: 'login',
      onChoose: jest.fn()
    }
    const wrapper = shallow(<DropdownButton {...props} />)
    expect(wrapper).toMatchSnapshot()
    const instance = wrapper.instance()
    instance.toggleExpanded()
    expect(instance.state.expanded).toBeTruthy()
    instance.toggleExpanded()
    expect(instance.state.expanded).toBeFalsy()
    instance.setState({ expanded: true })
    const choice = 123
    instance.onChoose(choice)
    expect(instance.state.expanded).toBeFalsy()
    expect(props.onChoose).toHaveBeenCalledWith(choice)
  })
})
