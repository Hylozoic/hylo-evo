// import { mapStateToProps, mapDispatchToProps, mergeProps } from './MessageSection.connector'
// import orm from 'store/models'

// describe('mapStateToProps', () => {
//   const session = orm.session(orm.getEmptyState())
//   const { MessageThread, Message, Person } = session

//   ;[
//     {id: '1', name: 'Alice'},
//     {id: '2', name: 'Bob'}
//   ].forEach(x => Person.create(x))

//   MessageThread.create({id: '11'})

//   ;[
//     {id: '4', text: 'hi', creator: '1', messageThread: '11'},
//     {id: '5', text: 'how are you', creator: '1', messageThread: '11'},
//     {id: '6', text: 'fine thanks', creator: '2', messageThread: '11'},
//     {id: '7', text: 'and you?', creator: '2', messageThread: '11'}
//   ].forEach(x => Message.create(x))

//   const state = {
//     orm: session.state,
//     pending: {
//       FETCH_MESSAGES: true
//     },
//     queryResults: {
//       '{"type":"FETCH_MESSAGES","params":{"id":"11"}}': {
//         hasMore: true,
//         total: 77,
//         ids: ['4', '5', '6', '7']
//       }
//     }
//   }

//   const props = {
//     messageThreadId: '11'
//   }

//   it('returns expected values', () => {
//     expect(mapStateToProps(state, props)).toMatchSnapshot()
//   })
// })

// describe('mapDispatchToProps', () => {
//   it('returns expected values', () => {
//     const dispatch = () => {}
//     const props = {
//       messageThreadId: '7'
//     }
//     expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
//   })
// })

// describe('mergeProps', () => {
//   it('returns expected values', () => {
//     const stateProps = {
//       messages: [
//         {id: '1', text: 'hi'}
//       ]
//     }

//     const dispatchProps = {
//       fetchMessagesMaker: cursor => () => `more messages for thread ${cursor}`,
//       updateThreadReadTime: () => {},
//       reconnectFetchMessages: () => {}
//     }

//     const ownProps = {
//       messageThreadId: '7'
//     }

//     const props = mergeProps(stateProps, dispatchProps, ownProps)
//     expect(props).toMatchSnapshot()
//     expect(props.fetchMessages()).toEqual('more messages for thread 1')
//   })
// })
