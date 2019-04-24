import { updateAllMemberships, registerStripeAccount } from './UserSettings.store'

describe('updateAllMemberships', () => {
  it('matches snapshot', () => {
    expect(updateAllMemberships([1, 3, 5], { sendEmail: true })).toMatchSnapshot()
  })
})

describe('registerStripeAccount', () => {
  it('matches snapshot', () => {
    expect(registerStripeAccount('anauthorizationcodexyz')).toMatchSnapshot()
  })
})
