import { connect } from 'react-redux'
import {
  fetchThread,
  getThread
} from './Thread.store'
import { getMe } from 'store/selectors/getMe'
import { getSocket, socketUrl } from 'client/websockets'

export function mapStateToProps (state, props) {
  const thread = getThread(state, props) || { id: props.match.params.threadId }
  return {
    currentUser: getMe(state),
    thread
  }
}

function mapDispatchToProps (dispatch, props) {
  const { threadId } = props.match.params

  return {
    fetchThread: () => dispatch(fetchThread(threadId)),

    subscribe: function (oldHandler) {
      const socket = getSocket()
      if (oldHandler) socket.off('reconnect', oldHandler)

      const newHandler = () => {
        socket.post(socketUrl(`/noo/post/${threadId}/subscribe`))
      }

      socket.on('reconnect', newHandler)
      newHandler()

      // return the handler so it can be assigned to a component-local variable
      // and passed as an argument for a later call to unsubscribe
      return newHandler
    },

    unsubscribe: function (oldHandler) {
      const socket = getSocket()
      socket.off('reconnect', oldHandler)
      socket.post(socketUrl(`/noo/post/${threadId}/unsubscribe`))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
