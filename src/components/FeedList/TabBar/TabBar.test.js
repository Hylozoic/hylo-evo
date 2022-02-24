import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import TabBar from './TabBar'

let container = null

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('renders sort options', () => {
  act(() => {
    render(<TabBar />, container)
  })

  expect(container.querySelector('[data-stylename=dropdown]'))
    .toMatchInlineSnapshot(`
    <div
      data-stylename="dropdown"
    >
      <span
        data-stylename="dropdown-toggle"
      >
        <span
          data-stylename="sorter-label"
        >
          Latest Activity
          <span
            class="icon-ArrowDown"
            data-stylename="icon"
          />
        </span>
      </span>
      <div
        data-stylename="wrapper alignRight"
      >
        <ul
          data-stylename="dropdown-menu alignRight"
        />
      </div>
    </div>
  `)
})

it('renders tabs', () => {
  act(() => {
    render(<TabBar />, container)
  })

  expect(container.querySelector('[data-stylename=tabs]'))
    .toMatchInlineSnapshot(`
    <div
      data-stylename="tabs"
    >
      <div
        data-stylename="filterLabel"
      >
        Post types: 
        <strong>
          all
        </strong>
         
        <span
          class="icon-ArrowDown"
          data-stylename="icon"
        />
      </div>
      <span
        data-stylename="tab-active"
      >
        All
      </span>
      <span
        data-stylename="tab"
      >
        Discussions
      </span>
      <span
        data-stylename="tab"
      >
        Requests
      </span>
      <span
        data-stylename="tab"
      >
        Offers
      </span>
      <span
        data-stylename="tab"
      >
        Resources
      </span>
    </div>
  `)
})
