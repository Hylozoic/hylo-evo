import DownloadAppModal from './DownloadAppModal'
import { shallow } from 'enzyme'
import React from 'react'

it('matches last snapshot', () => {
  const props = {
    url: 'some-url.com'
  }
  const wrapper = shallow(<DownloadAppModal {...props} />)
  expect(wrapper).toMatchSnapshot()
})
