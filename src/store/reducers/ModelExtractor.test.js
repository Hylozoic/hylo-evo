import testPayloads from './ModelExtractor.test.json'
import ModelExtractor from './ModelExtractor'
import orm from '../models'

const payload = testPayloads['FETCH_POSTS for me']
const payload2 = testPayloads['FETCH_POSTS for community']

it('produces a flat list from a "separate-totals-style" response', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  extractor.walk(payload.data.me, 'Me')
  expect(extractor.mergedNodes()).toMatchSnapshot()
})

it('produces a flat list from a "nested-totals-style" response', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  extractor.walk(payload2.data.community, 'Community')
  expect(extractor.mergedNodes()).toMatchSnapshot()
})
