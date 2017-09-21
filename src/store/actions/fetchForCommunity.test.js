import fetchForCommunity from './fetchForCommunity'

it('works with a slug', () => {
  expect(fetchForCommunity('anyslug')).toMatchSnapshot()
})
