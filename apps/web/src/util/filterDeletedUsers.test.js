import filterDeletedUsers from './filterDeletedUsers'

it('Returns true for regular user', () => {
  const testUser = { name: 'Flowers' }
  expect(filterDeletedUsers(testUser)).toBeTruthy()
})

it('Returns false for deleted user', () => {
  const deletedUser = { name: 'Deleted User' }
  expect(filterDeletedUsers(deletedUser)).toBeFalsy()
})
