import React from 'react'
import { shallow } from 'enzyme'
import GroupsList, { groupRow, groupCell } from './GroupsList'

describe('GroupsList', () => {
  it('matches last snapshot with 1 group', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<GroupsList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot with 2 groups', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<GroupsList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot with 5 group', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        },
        {
          id: 3,
          name: 'Three',
          slug: 'three'
        },
        {
          id: 4,
          name: 'Four',
          slug: 'four'
        },
        {
          id: 5,
          name: 'Five',
          slug: 'five'
        }
      ],
      expandFunc: () => {}
    }

    const wrapper = shallow(<GroupsList {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('groupRow', () => {
  it('matches last snapshot with 1 group', () => {
    const props = {
      groups: [
        {
          id: 1,
          name: 'One',
          slug: 'one'
        },
        {
          id: 2,
          name: 'Two',
          slug: 'two'
        }
      ]
    }

    const wrapper = shallow(<groupRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('groupCell', () => {
  it('matches last snapshot with 1 group', () => {
    const props = {
      group: [
        {
          id: 1,
          name: 'One',
          slug: 'one',
          avatarUrl: 'one.png'
        }
      ]
    }

    const wrapper = shallow(<groupCell {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
