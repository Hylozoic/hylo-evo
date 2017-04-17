import orm from '../models'
import { getMe } from './getMe'

it('returns Me', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({
    id: '1',
    name: 'Joe Smith'
  })

  const result = getMe({orm: session.state})

  expect(result.name).toEqual('Joe Smith')
  expect(result.id).toEqual('1')
})
