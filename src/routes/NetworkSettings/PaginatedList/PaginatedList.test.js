import PaginatedList, { PaginationLinks } from './index'
import { shallow } from 'enzyme'
import React from 'react'

describe('PaginatedList', () => {
  it('renders correctly', () => {
    const items = [{id: 2}, {id: 3}]

    const wrapper = shallow(<PaginatedList
      isAdmin
      items={items}
      page={3}
      pageCount={5}
      setPage={() => {}}
      itemProps={{square: true, size: 40}}
      renderItem={item => <div>{item.id}</div>} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('PaginationLinks', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PaginationLinks
      isAdmin
      page={3}
      pageCount={5}
      setPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders null with 1 page', () => {
    const wrapper = shallow(<PaginationLinks
      page={1}
      pageCount={1}
      setPage={() => {}} />)
    expect(wrapper.html()).toEqual(null)
  })
})
