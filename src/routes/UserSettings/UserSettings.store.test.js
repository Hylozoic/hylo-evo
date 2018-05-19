import { updateAllMemberships } from './UserSettings.store'

describe('updateAllMemberships', () => {
  it('matches snapshot', () => {
    expect(updateAllMemberships([1, 3, 5], {sendEmail: true})).toMatchSnapshot()
  })
})
