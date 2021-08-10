import CreateGroup from './CreateGroup'
import { shallow } from 'enzyme'
import React from 'react'

describe('CreateGroup', () => {

  it('matches snapshot', () => {
    const wrapper = shallow(<CreateGroup />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Allows for passing in initial name and slug via query parameters', () => {
    const wrapper = shallow(<CreateGroup initialName='Epic Name' initialSlug='bananaslug' />)
    expect(wrapper).toMatchSnapshot()
  })

})
