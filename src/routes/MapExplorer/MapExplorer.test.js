import React from 'react'
import { shallow } from 'enzyme'
import MapExplorer from './MapExplorer'

describe('MapExplorer', () => {

  it('Matches Snapshot', () => {
    const wrapper = shallow(<MapExplorer
      centerLocation={{ lat: 35.442845, lng: 7.916598 }}
      groups={[]}
      hideDrawer={false}
      fetchPosts={jest.fn()}
      fetchSavedSearches={jest.fn()}
      filters={{ featureTypes: { request: true, offer: true } }}
      match={{ params: {} }}
      members={[]}
      postsForDrawer={[]}
      postsForMap={[]}
      routeParams={{}}
      storeFetchPostsParam={jest.fn()}
      topics={[]}
      zoom={0}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('has a TabBar', () => {
    const wrapper = shallow(<MapExplorer
      storeFetchPostsParam={jest.fn()}
      fetchPosts={jest.fn()}
      fetchSavedSearches={jest.fn()}
      match={{ params: {} }}
      filters={{ featureTypes: { request: true, offer: true } }}
    />)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })

})
