import DownloadAppModal from './DownloadAppModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const url = 'some.url'
  const wrapper = shallow(<DownloadAppModal url={url} />)
  expect(wrapper).toMatchSnapshot()
})
