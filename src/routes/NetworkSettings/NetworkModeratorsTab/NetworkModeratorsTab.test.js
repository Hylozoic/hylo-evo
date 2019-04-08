import NetworkModeratorsTab, { ModeratorSuggestionRow } from './NetworkModeratorsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('NetworkModeratorsTab', () => {
  it('renders correctly', () => {
    const modSuggestions = [{id: 2, name: 'jo', avatarUrl: 'jo.png'}, {id: 3, name: 'sam', avatarUrl: 'sam.png'}]

    const wrapper = shallow(<NetworkModeratorsTab
      moderatorsPage={1}
      moderatorsPageCount={2}
      moderatorsPending={false}
      moderatorAutocompleteCandidates={modSuggestions}
      network={{id: 1}}
      removeNetworkModeratorRole={() => {}}
      setModeratorsPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ModeratorSuggestionRow', () => {
  it('renders correctly', () => {
    const person = {id: 2, name: 'jo', avatarUrl: 'jo.png'}

    const wrapper = shallow(<ModeratorSuggestionRow
      person={person}
      isHighlighted />)
    expect(wrapper).toMatchSnapshot()
  })
})

