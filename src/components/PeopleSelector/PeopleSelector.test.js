import { mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import React from 'react'

import { keyMap } from 'util/textInput'
import PeopleSelector from './PeopleSelector'
import PersonListItem from 'components/PersonListItem'

describe('PeopleSelector', () => {
  it('matches the last snapshot', () => {
    const wrapper = shallow(
      <PeopleSelector
        fetchContacts={() => {}}
        fetchPeople={() => {}}
        matches={[]}
        fetchRecentContacts={jest.fn()}
        participants={[]}
        onCloseURL='' />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('onKeyDown', () => {
    let addParticipant
    let fetchPeople
    let removeParticipant
    let input
    let setAutocomplete
    let wrapper

    beforeEach(() => {
      addParticipant = jest.fn()
      fetchPeople = jest.fn()
      removeParticipant = jest.fn()
      setAutocomplete = jest.fn()
      wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            addParticipant={addParticipant}
            matches={[ { id: '1' }, { id: '2' } ]}
            participants={[]}
            fetchContacts={() => {}} fetchPeople={fetchPeople} fetchRecentContacts={() => {}}
            removeParticipant={removeParticipant}
            setAutocomplete={setAutocomplete}
            onCloseURL='' />
        </MemoryRouter>
      )
      wrapper.find(PeopleSelector).instance().setState({ currentMatch: '1' })
      input = wrapper.find('input').first()
    })

    it('does not hit server when backspace is pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(fetchPeople).not.toHaveBeenCalled()
    })

    it('hits server when keys other than backspace are pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.SPACE })
      expect(fetchPeople).toHaveBeenCalled()
    })

    it('removes participant if backspace pressed when currentMatch missing', () => {
      wrapper.find(PeopleSelector).instance().setState({ currentMatch: null })
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(removeParticipant).toHaveBeenCalled()
    })

    it('does not remove participant if backspace pressed when currentMatch defined', () => {
      input.simulate('keyDown', { keyCode: keyMap.BACKSPACE })
      expect(removeParticipant).not.toHaveBeenCalled()
    })

    it('calls arrow with `up` if up arrow pressed', () => {
      const arrow = PeopleSelector.prototype.arrow
      PeopleSelector.prototype.arrow = jest.fn()
      input.simulate('keyDown', { keyCode: keyMap.UP })
      const calls = PeopleSelector.prototype.arrow.mock.calls
      expect(calls[calls.length - 1][0]).toBe('up')
      PeopleSelector.prototype.arrow = arrow
    })

    it('calls arrow with `down` if down arrow pressed', () => {
      const arrow = PeopleSelector.prototype.arrow
      PeopleSelector.prototype.arrow = jest.fn()
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      const calls = PeopleSelector.prototype.arrow.mock.calls
      expect(calls[calls.length - 1][0]).toBe('down')
      PeopleSelector.prototype.arrow = arrow
    })

    it('does not change active match if at top of list when up arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.UP })
      const actual = wrapper.find(PersonListItem).first().prop('active')
      expect(actual).toBe(true)
    })

    it('changes active match if not at top of list when up arrow pressed', () => {
      wrapper.find(PeopleSelector).instance().setState({ currentMatch: '2' })
      input.simulate('keyDown', { keyCode: keyMap.UP })
      const actual = wrapper.find(PersonListItem).last().prop('active')
      expect(actual).toBe(false)
    })

    it('does not change active match if at bottom of list when down arrow pressed', () => {
      wrapper.find(PeopleSelector).instance().setState({ currentMatch: '2' })
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      const actual = wrapper.find(PersonListItem).last().prop('active')
      expect(actual).toBe(true)
    })

    it('changes active match if not at bottom of list when down arrow pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.DOWN })
      const actual = wrapper.find(PersonListItem).first().prop('active')
      expect(actual).toBe(false)
    })

    it('calls addParticipant with currentMatch when enter pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.ENTER })
      expect(addParticipant).toBeCalledWith('1')
    })

    it('calls addParticipant with currentMatch when comma pressed', () => {
      input.simulate('keyDown', { keyCode: keyMap.COMMA })
      expect(addParticipant).toBeCalledWith('1')
    })

    it('resets values after adding participants', () => {
      input.simulate('keyDown', { keyCode: keyMap.ENTER })
      expect(setAutocomplete).toBeCalledWith(null)
      expect(input.instance().value).toBe('')
    })
  })

  describe('setAutocomplete', () => {
    let setAutocomplete
    let wrapper

    beforeEach(() => {
      jest.useFakeTimers()
      setAutocomplete = jest.fn()
      wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            fetchContacts={() => {}} fetchPeople={() => {}} fetchRecentContacts={() => {}}
            participants={[]}
            setAutocomplete={setAutocomplete}
            onCloseURL='' />
        </MemoryRouter>
      )
    })

    it('updates if user input contains valid characters', () => {
      const expected = 'Poor Yorick'
      const input = wrapper.find('input').first()
      input.instance().value = expected
      input.simulate('change')
      jest.runAllTimers()
      const actual = setAutocomplete.mock.calls[0][0]
      expect(actual).toBe(expected)
    })

    it('does not update if user input contains invalid characters', () => {
      const invalid = 'Poor Yorick9238183$@#$$@!'
      const expected = 'Poor Yorick'
      const input = wrapper.find('input').first()
      input.instance().value = invalid
      input.simulate('change')
      jest.runAllTimers()
      expect(setAutocomplete).not.toHaveBeenCalled()
      expect(input.instance().value).toBe(expected)
    })
  })

  describe('addParticipant', () => {
    it('calls addParticipant with the correct id', () => {
      const addParticipant = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            addParticipant={addParticipant}
            participants={[]}
            fetchContacts={() => {}} fetchPeople={() => {}} fetchRecentContacts={() => {}}
            setAutocomplete={() => {}}
            onCloseURL='' />
        </MemoryRouter>
      )
      wrapper.find(PeopleSelector).instance().addParticipant('1')
      expect(addParticipant).toBeCalledWith('1')
    })

    it('resets values after adding a participant', () => {
      const setAutocomplete = jest.fn()
      const wrapper = mount(
        <MemoryRouter>
          <PeopleSelector
            addParticipant={() => {}}
            participants={[]}
            fetchContacts={() => {}} fetchPeople={() => {}} fetchRecentContacts={() => {}}
            setAutocomplete={setAutocomplete}
            onCloseURL='' />
        </MemoryRouter>
      )
      const input = wrapper.find('input').first()
      input.instance().value = 'flargle'
      wrapper.find(PeopleSelector).instance().addParticipant('1')
      expect(input.instance().value).toBeFalsy()
      expect(setAutocomplete).toBeCalledWith(null)
    })
  })

  describe('removeParticipant', () => {
    it('calls props.removeParticipant', () => {
      const removeParticipant = jest.fn()
      const wrapper = shallow(
        <PeopleSelector
          fetchPeople={() => {}}
          participants={[]}
          fetchContacts={jest.fn()}
          fetchRecentContacts={jest.fn()}
          removeParticipant={removeParticipant}
          onCloseURL='' />
      )
      const ps = wrapper.instance()
      ps.autocomplete = { value: '' }
      ps.removeParticipant('1')
      expect(removeParticipant).toBeCalledWith('1')
    })

    it('sets currentMatch to null if nothing being typed', () => {
      const wrapper = shallow(
        <PeopleSelector
          fetchPeople={() => {}}
          participants={[]}
          fetchContacts={jest.fn()}
          fetchRecentContacts={jest.fn()}
          removeParticipant={() => {}}
          onCloseURL='' />
      )
      const ps = wrapper.instance()
      ps.autocomplete = { value: '' }
      ps.state = { currentMatch: 'abc' }
      ps.removeParticipant('1')
      expect(ps.state.currentMatch).toBe(null)
    })

    it('does not set currentMatch to null if autocomplete in use', () => {
      const wrapper = shallow(
        <PeopleSelector
          fetchPeople={() => {}}
          participants={[]}
          fetchContacts={jest.fn()}
          fetchRecentContacts={jest.fn()}
          removeParticipant={() => {}}
          onCloseURL='' />
      )
      const ps = wrapper.instance()
      ps.autocomplete = { value: 'abc' }
      ps.state = { currentMatch: 'abc' }
      ps.removeParticipant('1')
      expect(ps.state.currentMatch).toBe('abc')
    })
  })

  describe('componentDidMount', () => {
    it('adds particpants in the search, then clears it', () => {
      const addParticipant = jest.fn()
      const changeQueryParam = jest.fn()
      mount(
        <MemoryRouter>
          <PeopleSelector
            addParticipant={addParticipant}
            participants={[]}
            participantSearch={[ '1', '2' ]}
            fetchContacts={() => {}} fetchPeople={() => {}} fetchRecentContacts={() => {}}
            changeQueryParam={changeQueryParam}
            onCloseURL='' />
        </MemoryRouter>
      )
      expect(addParticipant).toBeCalledWith('1')
      expect(addParticipant).toBeCalledWith('2')
      const [ _, param, value ] = changeQueryParam.mock.calls[0]
      expect(param).toBe('participants')
      expect(value).toBe(null)
    })
  })
})
