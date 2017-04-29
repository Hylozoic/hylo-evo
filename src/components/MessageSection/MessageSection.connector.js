import { isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import {
  fetchMessages,
  getMessages,
  getHasMoreMessages,
  getTotalMessages,
  updateThreadReadTime
} from './MessageSection.store'
import { FETCH_MESSAGES } from 'store/constants'
import { getSocket } from 'client/websockets'

export function mapStateToProps (state, props) {
  return {
    messages: getMessages(state, props),
    pending: !!state.pending[FETCH_MESSAGES],
    total: getTotalMessages(state, {id: props.messageThreadId}),
    hasMore: getHasMoreMessages(state, {id: props.messageThreadId}),
    currentUser: getMe(state),
    socket: getSocket()
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchMessagesMaker: cursor => () => dispatch(fetchMessages(props.messageThreadId, {cursor})),
    updateThreadReadTime: id => dispatch(updateThreadReadTime(id)),
    reconnectFetchMessages: () => dispatch(fetchMessages(props.messageThreadId, {reset: true}))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { messages } = stateProps
  const { fetchMessagesMaker } = dispatchProps
  const cursor = !isEmpty(messages) && messages[0].id
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchMessages: fetchMessagesMaker(cursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, {withRef: true})
