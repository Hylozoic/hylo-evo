import { connect } from 'react-redux'
import { getSocket, socketUrl } from 'client/websockets'

function mapDispatchToProps (dispatch, props) {
  const { id, type } = props

  if (!id) {
    return {
      subscribe: () => {},
      unsubscribe: () => {}
    }
  }

  return {
    subscribe: function (oldHandler) {
      const socket = getSocket()
      if (oldHandler) socket.off('reconnect', oldHandler)

      const newHandler = () => {
        socket.post(socketUrl(`/noo/${type}/${id}/subscribe`))
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
      socket.post(socketUrl(`/noo/${type}/${id}/unsubscribe`))
    }
  }
}

export default connect(null, mapDispatchToProps)
