import mobileRedirect from './mobileRedirect'

jest.mock('ismobilejs', () => ({
  apple: {
    device: true,
    phone: true
  }
}))

it('returns truthy if mobile', () => {
  expect(mobileRedirect()).toBeTruthy()
})
