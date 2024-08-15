import React from 'react'
import CardImageAttachments from './CardImageAttachments'
import { shallow } from 'enzyme'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import userEvent from '@testing-library/user-event'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  },
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

it('renders no images', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'bonkerz', type: 'file' },
    { url: 'bonkers', type: 'file' },
    { url: 'bonkerzztop', type: 'file' }
  ]} />)).toEqual({})
})

it('renders a single image', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'foo', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})

it('renders multiple images', () => {
  expect(shallow(<CardImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)).toMatchSnapshot()
})

it('displays modal when image is clicked', async () => {
  render(<CardImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' },
    { url: 'bonkerz', type: 'file' }
  ]} />)

  expect(await screen.findByAltText('Attached image 1')).toBeInTheDocument()
  expect(await screen.findByAltText('Attached image 2')).toBeInTheDocument()
  expect(await screen.findByAltText('Attached image 3')).toBeInTheDocument()
  expect(await screen.queryByAltText('Attached image 4')).not.toBeInTheDocument()

  userEvent.click(await screen.findByAltText('Attached image 2'))
  // slick clones these for infinite scrolling, the last one is double-cloned
  expect((await screen.findAllByTestId('sc-img0')).length).toBe(2)
  expect((await screen.findAllByTestId('sc-img1')).length).toBe(2)
  expect((await screen.findAllByTestId('sc-img2')).length).toBe(3)

  // implementation dependent, but the only way to test that the active slide is image 2
  expect(((await screen.findAllByTestId('sc-img0'))[0]).parentNode.parentNode).toHaveAttribute('aria-hidden', 'true')
  expect(((await screen.findAllByTestId('sc-img1'))[0]).parentNode.parentNode).toHaveAttribute('aria-hidden', 'false')
  expect(((await screen.findAllByTestId('sc-img2'))[0]).parentNode.parentNode).toHaveAttribute('aria-hidden', 'true')
})

it('does not displays modal when image is clicked from postCard', async () => {
  render(<CardImageAttachments attachments={[
    { url: 'bar', type: 'image' },
    { url: 'baz', type: 'image' },
    { url: 'bonk', type: 'image' }
  ]} className='post-card' />)

  userEvent.click(await screen.findByAltText('Attached image 1'))
  await expect(() => screen.getByTestId('sc-img0')).toThrow('Unable to find an element by: [data-testid="sc-img0"]')
})
