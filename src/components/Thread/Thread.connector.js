import { connect } from 'react-redux'
import {
  fetchThread,
  getThread
} from './Thread.store'
import { getMe } from 'store/selectors/getMe'
import { getSocket, socketUrl } from 'client/websockets'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    thread: getThread(state, props)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    fetchThread: () => dispatch(fetchThread(props.threadId)),

    subscribe: function (oldHandler) {
      const socket = getSocket()
      if (oldHandler) socket.off('reconnect', oldHandler)

      const newHandler = () => {
        socket.post(socketUrl(`/noo/post/${props.threadId}/subscribe`))
      }

      socket.on('reconnect', newHandler)
      newHandler()

      // return the handler so it can be assigned to a component-local variable
      // and passed as an argument for a later call to unsubscribe
      return newHandler
    },

    unsubscribe: function (oldHandler, threadId = props.threadId) {
      const socket = getSocket()
      socket.off('reconnect', oldHandler)
      socket.post(socketUrl(`/noo/post/${threadId}/unsubscribe`))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
