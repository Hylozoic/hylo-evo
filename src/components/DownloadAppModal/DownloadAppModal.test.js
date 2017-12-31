import DownloadAppModal from './DownloadAppModal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const url = 'some.url'
  const header = 'modal header'
  const wrapper = shallow(<DownloadAppModal url={url} header={header} />)
  expect(wrapper).toMatchSnapshot()
})
