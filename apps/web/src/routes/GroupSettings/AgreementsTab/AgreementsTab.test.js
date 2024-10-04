import AgreementsTab from './AgreementsTab'
import React from 'react'
import orm from 'store/models'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }

  return AllTheProviders(reduxState)
}

const fooGroup = {
  id: 1,
  slug: 'bar',
  name: 'Barmunity',
  avatarUrl: '/bar.png',
  agreements: [
    {
      id: 1,
      title: 'Making smoothies',
      description: 'We agree to make smoothies for each other on the regular'
    }
  ]
}

describe('AgreementsTab', () => {
  it('renders nicely', async () => {
    // const wrapper = shallow(<AgreementsTab group={fooGroup} />)
    render(
      <AgreementsTab group={fooGroup} />,
      { wrapper: testProviders() }
    )
    expect(screen.getByDisplayValue('Making smoothies')).toBeInTheDocument()
  })
})
