/* eslint-env jest */
import { merge } from 'lodash'
import reducer, {
  FETCH_LINK_PREVIEW,
  REMOVE_LINK_PREVIEW,
  CLEAR_LINK_PREVIEW,
  SET_ANNOUNCEMENT,
  defaultState,
  fetchLinkPreview,
  setAnnouncement,
  showAnnouncementConfirmation
} from './PostEditor.store'

describe('PostEditor store', () => {
  const validLinkPreview = {
    id: 'found',
    title: 'has a title'
  }
  describe('reducer', () => {
    describe(`when ${FETCH_LINK_PREVIEW}`, () => {
      test('linkPreviewId is set if record is found', () => {
        const action = merge(fetchLinkPreview(), {
          payload: {
            data: {
              findOrCreateLinkPreviewByUrl: validLinkPreview
            }
          }
        })
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toEqual(validLinkPreview.id)
        expect(finalState.linkPreviewStatus).toEqual(null)
        expect(finalState).toMatchSnapshot()
      })
      test('linkPreviewId is not set status is "invalid" if a record is not found', () => {
        const action = merge(fetchLinkPreview(), {
          payload: {
            data: {
              findOrCreateLinkPreviewByUrl: {}
            }
          }
        })
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('invalid')
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${REMOVE_LINK_PREVIEW}`, () => {
      const action = { type: REMOVE_LINK_PREVIEW }
      test('linkPreviewId is cleared and status set to "removed"', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('removed')
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${CLEAR_LINK_PREVIEW}`, () => {
      const action = { type: CLEAR_LINK_PREVIEW }
      test('linkPreviewId is cleared and status set to "cleared"', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState.linkPreviewId).toBeFalsy()
        expect(finalState.linkPreviewStatus).toEqual('cleared')
        expect(finalState).toMatchSnapshot()
      })
    })

    describe(`when ${SET_ANNOUNCEMENT}`, () => {
      const action = {
        type: SET_ANNOUNCEMENT,
        payload: true
      }
      test('announcement is set approrpiately', () => {
        const finalState = reducer(defaultState, action)
        expect(finalState.announcement).toEqual(true)
        expect(finalState).toMatchSnapshot()
      })
    })
  })
  test('setAnnouncement', () => {
    const type = 'type'
    expect(setAnnouncement(type)).toMatchSnapshot()
  })
  test('showAnnouncementConfirmation', () => {
    const bool = true
    expect(showAnnouncementConfirmation(bool)).toMatchSnapshot()
  })
})
