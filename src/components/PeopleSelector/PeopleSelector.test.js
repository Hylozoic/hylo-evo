import { mount, shallow } from 'enzyme'
import { MemoryRouter } from 'react-router'
import React from 'react'

import { keyMap } from 'util/textInput'
import PeopleSelector from './PeopleSelector'

describe('PeopleSelector', () => {

  it('matches the last snapshot', () => {
    const wrapper = shallow(
      <PeopleSelector
        fetchContacts={() => {}}
        fetchPeople={() => {}}
        matches={[]}
        participants={[]} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('does not hit server when backspace is pressed', () => {
    const fetchPeople = jest.fn()
    const wrapper = mount(
      <MemoryRouter>
        <PeopleSelector
          participants={[]}
          fetchContacts={() => {}}
          fetchPeople={fetchPeople}
          removeParticipant={() => {}}/>
      </MemoryRouter>
    )
    wrapper.find('input').first().simulate('keyDown', { keyCode: keyMap.BACKSPACE })
    expect(fetchPeople).not.toHaveBeenCalled()
  })

  it('hits server when keys other than backspace are pressed', () => {
    const fetchPeople = jest.fn()
    const wrapper = mount(
      <MemoryRouter>
        <PeopleSelector
          participants={[]}
          fetchContacts={() => {}}
          fetchPeople={fetchPeople} />
      </MemoryRouter>
    )
    wrapper.find('input').first().simulate('keyDown', { keyCode: keyMap.SPACE })
    expect(fetchPeople).toHaveBeenCalled()
  })

  describe('setAutocomplete', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('updates if user input contains valid characters', () => {
      const expected = 'Poor Yorick'
      const setAutocomplete = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            fetchContacts={() => {}}
            fetchPeople={() => {}}
            participants={[]}
            setAutocomplete={setAutocomplete} />
        </MemoryRouter>
      )
      const input = wrapper.find('input').first()
      input.node.value = expected
      input.simulate('change')
      jest.runAllTimers()

      const actual = setAutocomplete.mock.calls[0][0]
      expect(actual).toBe(expected)
    })

    it('does not update if user input contains invalid characters', () => {
      const invalid = 'Poor Yorick9238183$@#$$@!'
      const expected = 'Poor Yorick'
      const setAutocomplete = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            fetchContacts={() => {}}
            fetchPeople={() => {}}
            participants={[]}
            setAutocomplete={setAutocomplete} />
        </MemoryRouter>
      )
      const input = wrapper.find('input').first()
      input.node.value = invalid
      input.simulate('change')

      jest.runAllTimers()
      expect(setAutocomplete).not.toHaveBeenCalled()
      expect(input.node.value).toBe(expected)
    })
  })
})
