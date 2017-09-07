import React from 'react'
import { shallow } from 'enzyme'
import UploadPhoto from './UploadPhoto'

describe('UploadPhoto', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<UploadPhoto />)
    expect(wrapper).toMatchSnapshot()
  })
})
