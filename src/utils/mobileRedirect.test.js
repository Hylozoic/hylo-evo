import mobileRedirect from './mobileRedirect'
import isMobile from 'ismobilejs'
import React from 'react'

jest.mock('ismobilejs', () => ({
  apple: {
    device: true,
    phone: true
  }
}))

it ('returns truthy if mobile', () => {
  expect(mobileRedirect()).toBeTruthy()
})
