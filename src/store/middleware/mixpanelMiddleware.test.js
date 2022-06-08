import orm from 'store/models'
import mixpanelMiddleware from './mixpanelMiddleware'
import mixpanel from 'mixpanel-browser'

jest.mock('mixpanel-browser', () => ({
  track: jest.fn(),
  identify: jest.fn()
}))

describe('mixpanelMiddleware', () => {
  let mixpanelMiddlewareInstance

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({
      id: '1',
      name: 'Test User',
      hasRegistered: true,
      emailValidated: true,
      settings: {
        signupInProgress: false
      }
    })
    const store = {
      getState: () => ({
        current: {
          loggedIn: false
        },
        orm: session.state
      })
    }
    const next = () => {}
    mixpanelMiddlewareInstance = mixpanelMiddleware(store)(next)
  })

  test('when meta.analytics is a string sends tracking event by that name', () => {
    const eventName = 'Event Name'
    const analyticsAction = {
      type: 'Anything',
      meta: {
        analytics: eventName
      }
    }
    mixpanelMiddlewareInstance(analyticsAction)
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, {})
  })

  test('when meta.analytics is an object with an eventName sends eventName and data', () => {
    const eventName = 'Event Name From Object'
    const eventData = {
      somedata: 'anything'
    }
    const analyticsAction = {
      type: 'Anything',
      meta: {
        analytics: {
          eventName,
          ...eventData
        }
      }
    }
    mixpanelMiddlewareInstance(analyticsAction)
    expect(mixpanel.track).toHaveBeenCalledWith(eventName, eventData)
  })

  test('when meta.analytics is an object without an eventName uses action.type and data', () => {
    const actionType = 'Action Type Name'
    const eventData = {
      somedata: 'anything',
      someotherdata: 'anything2'
    }
    const analyticsAction = {
      type: actionType,
      meta: {
        analytics: {
          ...eventData
        }
      }
    }
    mixpanelMiddlewareInstance(analyticsAction)
    expect(mixpanel.track).toHaveBeenCalledWith(actionType, eventData)
  })
})
