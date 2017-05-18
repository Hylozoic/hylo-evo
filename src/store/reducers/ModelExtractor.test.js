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

it('handles ids for foreign keys', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  const comment = {
    id: '1',
    text: 'Hi!',
    creator: '2'
  }

  extractor.walk(comment, 'Comment')
  expect(extractor.mergedNodes()).toEqual([
    {
      modelName: 'Comment',
      payload: comment
    }
  ])
})

it('handles objects for foreign keys', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  const person = {
    id: '2',
    name: 'Alice'
  }
  const comment = {
    id: '1',
    text: 'Hi!',
    creator: person
  }

  extractor.walk(comment, 'Comment')
  expect(extractor.mergedNodes()).toEqual([
    {
      modelName: 'Person',
      payload: person
    },
    {
      modelName: 'Comment',
      payload: {
        ...comment,
        creator: person.id
      }
    }
  ])
})

it('handles an array root', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))

  extractor.walk([
    {
      id: '1',
      name: 'Alice',
      posts: [
        {id: '1', title: 'Hi!'}
      ]
    },
    {
      id: '2',
      name: 'Bob'
    }
  ], 'Person')

  expect(extractor.mergedNodes()).toEqual([
    {
      modelName: 'Post',
      payload: {id: '1', title: 'Hi!', creator: '1'}
    },
    {
      modelName: 'Person',
      payload: {id: '1', name: 'Alice'}
    },
    {
      modelName: 'Person',
      payload: {id: '2', name: 'Bob'}
    }
  ])
})

it('handles a query set root', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))

  extractor.walk({
    items: [
      {
        id: '1',
        name: 'Alice',
        posts: {
          hasMore: false,
          items: [
            {id: '1', title: 'Hi!'}
          ]
        }
      },
      {
        id: '2',
        name: 'Bob'
      }
    ]
  }, 'Person')

  expect(extractor.mergedNodes()).toEqual([
    {
      modelName: 'Post',
      payload: {id: '1', title: 'Hi!', creator: '1'}
    },
    {
      modelName: 'Person',
      payload: {id: '1', name: 'Alice'}
    },
    {
      modelName: 'Person',
      payload: {id: '2', name: 'Bob'}
    }
  ])
})

it('handles null children', () => {
  const extractor = new ModelExtractor(orm.session(orm.getEmptyState()))
  extractor.walk(testPayloads['FETCH_ACTIVITY'].data.activity, 'Activity')
  expect(extractor.mergedNodes()).toMatchSnapshot()
})
