import React from 'react'
import { shallow } from 'enzyme'
import Affiliation from './Affiliation'

describe('Affiliation', () => {
  it('matches last snapshot', () => {
    const props = {
      affiliation: { 
        id: "1",
        orgName: "La Fromagerie",
        role: "Cheesemongress",
        url: null,
        createdAt: "2020-12-09T23:01:17.431Z",
        updatedAt: "2020-12-09T23:01:17.431Z",
        isActive: true }
    }

    const wrapper = shallow(<Affiliation {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
