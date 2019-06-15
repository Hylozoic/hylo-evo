import { toUiKeyMap, toUiQuerySet, toInterfaceData, toUiData } from './dataMapping'

const uiData = {
  id: 'idhash',
  avatarUrl: 'avatarUrlthing'
}

const interfaceData = {
  agent_id: 'idhash',
  avatar_url: 'avatarUrlthing'
}

const resultDataset = [
  { 1: 'test' },
  { 2: 'test' }
]

it('toInterfaceData should match snapshot', () => {

  expect(toInterfaceData('person', uiData)).toMatchSnapshot()
})

it('toUiData should match snapshot', () => {
  expect(toUiData('person', interfaceData)).toMatchSnapshot()
})

it('toUiQuerySet should match snapshot', () => {
  expect(toUiQuerySet(resultDataset)).toMatchSnapshot()
})

it('toUiKeyMap should match snapshot', () => {

  expect(toUiKeyMap).toMatchSnapshot()
})
