import { toUiKeyMap, toUiQuerySet, toZomeData, toUiData } from './dataMapping'

const uiData = {
  id: 'idhash',
  avatarUrl: 'avatarUrlthing'
}

const zomeData = {
  agent_id: 'idhash',
  avatar_url: 'avatarUrlthing'
}

const resultDataset = [
  { 1: 'test' },
  { 2: 'test' }
]

it('toZomeData should match snapshot', () => {

  expect(toZomeData('person', uiData)).toMatchSnapshot()
})

it('toUiData should match snapshot', () => {
  expect(toUiData('person', zomeData)).toMatchSnapshot()
})

it('toUiQuerySet should match snapshot', () => {
  expect(toUiQuerySet(resultDataset)).toMatchSnapshot()
})

it('toUiKeyMap should match snapshot', () => {

  expect(toUiKeyMap).toMatchSnapshot()
})
