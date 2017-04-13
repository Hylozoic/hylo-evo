import testPayloads from './ModelExtractor.test.json'
import ModelExtractor from './ModelExtractor'
import orm from '../models'

const payload = testPayloads['FETCH_POSTS for me']

it('produces the expected flattened list of model instances', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  extractor.walk(payload.data.me, 'Me')
  expect(extractor.accumulator).toMatchSnapshot()
})
