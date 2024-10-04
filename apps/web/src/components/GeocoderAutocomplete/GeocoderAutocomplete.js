import React, { useState, useEffect, useRef } from 'react'
import FlipMove from 'react-flip-move'
import PropTypes from 'prop-types'
import xhr from 'xhr'

/**
 * Geocoder component: connects to Mapbox.com Geocoding API
 * and provides an autocompleting interface for finding locations.
 */

const GeocoderAutocomplete = ({
  accessToken,
  endpoint = 'https://api.tiles.mapbox.com',
  defaultInputValue = '',
  inputClass = '',
  resultClass = '',
  resultsClass = '',
  resultFocusClass = 'strong',
  inputPosition = 'top',
  inputPlaceholder = 'Search',
  showLoader = false,
  source = 'mapbox.places',
  proximity = '',
  bbox = '',
  types = '',
  onInputChange = () => {},
  onSelect = () => {},
  onSuggest = () => {},
  focusOnMount = true
}) => {
  const [state, setState] = useState({
    results: [],
    focus: null,
    loading: false,
    searchTime: new Date(),
    showList: false,
    inputValue: defaultInputValue,
    typedInput: ''
  })

  const inputRef = useRef(null)

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focusOnMount])

  useEffect(() => {
    if (defaultInputValue !== state.inputValue) {
      setState(prevState => ({ ...prevState, inputValue: defaultInputValue }))
    }
  }, [defaultInputValue, state.inputValue])

  const search = (
    endpoint,
    source,
    accessToken,
    proximity,
    bbox,
    types,
    query,
    callback
  ) => {
    const searchTime = new Date()
    const uri =
      endpoint +
      '/geocoding/v5/' +
      source +
      '/' +
      encodeURIComponent(query) +
      '.json' +
      '?access_token=' +
      accessToken +
      (proximity ? '&proximity=' + proximity : '') +
      (bbox ? '&bbox=' + bbox : '') +
      (types ? '&types=' + encodeURIComponent(types) : '')
    xhr(
      {
        uri,
        json: true
      },
      function (err, res, body) {
        callback(err, res, body, searchTime)
      }
    )
  }

  const onInput = (e) => {
    const value = e.target.value
    setState(prevState => ({
      ...prevState,
      loading: true,
      showList: true,
      inputValue: value,
      typedInput: value
    }))
    onInputChange(value)
    if (value === '') {
      setState(prevState => ({
        ...prevState,
        results: [],
        focus: null,
        loading: false,
        showList: false
      }))
    } else {
      search(
        endpoint,
        source,
        accessToken,
        proximity,
        bbox,
        types,
        value,
        onResult
      )
    }
  }

  const moveFocus = (dir) => {
    if (state.loading) return
    const focus =
      state.focus === null
        ? 0
        : Math.max(
          -1,
          Math.min(state.results.length - 1, state.focus + dir)
        )
    const inputValue =
      focus === -1
        ? state.typedInput
        : state.results[focus].place_name
    setState(prevState => ({
      ...prevState,
      focus,
      inputValue,
      showList: true
    }))
    onInputChange(inputValue)
  }

  const acceptFocus = () => {
    if (state.focus !== null && state.focus !== -1) {
      const inputValue = state.results[state.focus].place_name
      setState(prevState => ({ ...prevState, showList: false, inputValue }))
      onInputChange(inputValue)
      onSelect(state.results[state.focus])
    }
  }

  const onKeyDown = (e) => {
    switch (e.which) {
      case 38: // up
        e.preventDefault()
        moveFocus(-1)
        break
      case 40: // down
        e.preventDefault()
        moveFocus(1)
        break
      case 9: // tab
        acceptFocus()
        break
      case 27: // esc
        setState(prevState => ({ ...prevState, showList: false, results: [] }))
        break
      case 13: // enter
        if (state.results.length > 0 && state.focus == null) {
          clickOption(state.results[0], 0)
        }
        acceptFocus()
        e.preventDefault()
        break
      default:
        break
    }
  }

  const onResult = (err, res, body, searchTime) => {
    if (!err && body && body.features && state.searchTime <= searchTime) {
      setState(prevState => ({
        ...prevState,
        searchTime,
        loading: false,
        results: body.features,
        focus: body.features.length > 0 ? 0 : -1
      }))
      onSuggest(body.features)
    }
  }

  const clickOption = (place, listLocation, e) => {
    onInputChange(place.place_name)
    onSelect(place)
    setState(prevState => ({
      ...prevState,
      focus: listLocation,
      showList: false,
      inputValue: place.place_name
    }))
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (e) {
      e.preventDefault()
    }
  }

  const handleBlur = (e) => {
    if (
      !e ||
      !e.relatedTarget ||
      !e.relatedTarget.parentElement ||
      !e.relatedTarget.parentElement.parentElement ||
      e.relatedTarget.parentElement.parentElement.id !== 'react-geo-list'
    ) {
      setState(prevState => ({ ...prevState, showList: false }))
    }
  }

  const input = (
    <input
      ref={inputRef}
      className={inputClass}
      onKeyDown={onKeyDown}
      placeholder={inputPlaceholder}
      onBlur={handleBlur}
      type='text'
      value={state.inputValue || undefined}
      onChange={onInput}
    />
  )

  return (
    <div>
      {inputPosition === 'top' && input}
      <FlipMove
        delay={0}
        duration={200}
        enterAnimation='accordionVertical'
        leaveAnimation='accordionVertical'
        maintainContainerHeight
      >
        {state.results.length > 0 &&
          state.showList &&
            <ul
              key='needed-for-flip-move'
              id='react-geo-list'
              className={
                (showLoader && state.loading ? 'loading' : '') +
                ' ' +
                resultsClass
              }
            >
              {state.results.map((result, i) => (
                <li key={result.id}>
                  <a
                    href='#'
                    onClick={(e) => clickOption(result, i, e)}
                    tabIndex='-1'
                    className={
                      resultClass +
                      ' ' +
                      (i === state.focus
                        ? resultFocusClass
                        : '')
                    }
                  >
                    {result.place_name}
                  </a>
                </li>
              ))}
            </ul>}
      </FlipMove>
      {inputPosition === 'bottom' && input}
    </div>
  )
}

GeocoderAutocomplete.propTypes = {
  endpoint: PropTypes.string,
  defaultInputValue: PropTypes.string,
  source: PropTypes.string,
  inputClass: PropTypes.string,
  resultClass: PropTypes.string,
  resultsClass: PropTypes.string,
  inputPosition: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  resultFocusClass: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSuggest: PropTypes.func,
  onInputChange: PropTypes.func,
  accessToken: PropTypes.string.isRequired,
  proximity: PropTypes.string,
  bbox: PropTypes.string,
  showLoader: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  types: PropTypes.string
}

export default GeocoderAutocomplete
