import React from 'react'
import CardImageAttachments from './CardImageAttachments'
import { shallow } from 'enzyme'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import userEvent from '@testing-library/user-event'

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
  expect(await screen.findByTestId('sc-img0')).toBeInTheDocument()
  expect(await screen.findByTestId('sc-img1')).toBeInTheDocument()
  expect(await screen.findByTestId('sc-img2')).toBeInTheDocument()

  // implementation dependent, but the only way to test that the active slide is image 2
  expect((await screen.findByTestId('sc-img0')).parentNode.parentNode).toHaveAttribute('aria-hidden', 'true')
  expect((await screen.findByTestId('sc-img1')).parentNode.parentNode).toHaveAttribute('aria-hidden', 'false')
  expect((await screen.findByTestId('sc-img2')).parentNode.parentNode).toHaveAttribute('aria-hidden', 'true')
})
