import FullPageModal from './FullPageModal'
import { shallow } from 'enzyme'
import React from 'react'

describe('FullPageModal', () => {
  it('renders correctly with a single component', () => {
    const history = { length: 2 }
    const content = <div>The Content</div>
    const wrapper = shallow(<FullPageModal
      history={history}
      content={content} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly when passed children', () => {
    const history = { length: 2 }

    const wrapper = shallow(
      <FullPageModal history={history}>
        <div>First Child</div>
        <div>Second Child</div>
      </FullPageModal>)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with multiple tabs', () => {
    const history = { length: 2 }
    const content = [
      {
        name: 'Account',
        path: '/settings',
        component: <div>Account Page</div>
      },
      {
        name: 'Groups',
        path: '/settings/groups',
        component: <div>Groups Page</div>
      }
    ]
    const wrapper = shallow(<FullPageModal
      history={history}
      content={content} />)
    expect(wrapper).toMatchSnapshot()
  })
})
