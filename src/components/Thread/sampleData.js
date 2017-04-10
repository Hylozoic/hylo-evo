export default {
  id: '1',
  lastReadAt: '',

  messagesTotal: 100,
  participants: [
    {id: '1', name: 'Person 1'},
    {id: '2', name: 'Person 2'},
    {id: '7', name: 'Person 7'}
  ]
}

export const messages = [
  {
    id: '1',
    text: 'hello',
    creator: {
      id: '2',
      name: 'Person 2'
    },
    createdAt: 'date'
  }
]
