import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { shallow } from 'enzyme'
import MapExplorer from './MapExplorer'

describe('MapExplorer', () => {
  it('Matches Snapshot', () => {
    const wrapper = shallow(
      <BrowserRouter>
        <MapExplorer
          centerLocation={{ lat: 35.442845, lng: 7.916598 }}
          fetchPosts={jest.fn()}
          fetchSavedSearches={jest.fn()}
          filters={{ featureTypes: { request: true, offer: true } }}
          groups={[]}
          hideDrawer={false}
          match={{ params: {} }}
          members={[]}
          postsForDrawer={[]}
          postsForMap={[]}
          routeParams={{}}
          storeFetchPostsParam={jest.fn()}
          topics={[]}
          zoom={0}
        />
      </BrowserRouter>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('has a TabBar', () => {
    const wrapper = shallow(
      <BrowserRouter>
        <MapExplorer
          fetchPosts={jest.fn()}
          fetchSavedSearches={jest.fn()}
          filters={{ featureTypes: { request: true, offer: true } }}
          match={{ params: {} }}
          storeFetchPostsParam={jest.fn()}
        />
      </BrowserRouter>
    )
    expect(wrapper.find('TabBar')).toBeTruthy()
  })
})
