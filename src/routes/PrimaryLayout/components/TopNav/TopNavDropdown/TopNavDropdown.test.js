import TopNavDropdown from './TopNavDropdown'
import { shallow } from 'enzyme'
import React from 'react'

const topNavPosition = {
  rightX: 1280,
  height: 56
}

describe('TopNavDropdown', () => {
  it('renders correctly', () => {
    const toggleChildren = <div>toggle</div>
    const header = <div>header</div>
    const body = <div>body</div>

    const wrapper = shallow(<TopNavDropdown
      topNavPosition={topNavPosition}
      toggleChildren={toggleChildren}
      header={header}
      body={body}
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('div').at(2).prop('data-stylename')).toEqual('wrapper animateFadeInDown')
    wrapper.find('a').simulate('click')
    expect(wrapper.find('div').at(3).prop('data-stylename')).toEqual('wrapper animateFadeInDown active')
  })
})
