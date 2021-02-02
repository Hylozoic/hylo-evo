import { connect } from 'react-redux'
import { getSocket, socketUrl } from 'client/websockets'
import { isEqual } from 'lodash'
import rollbar from 'client/rollbar'

function mapDispatchToProps (dispatch, props) {
  const { id, type } = props
  if (!['post', 'group'].includes(type)) {
    throw new Error(`unrecognized SocketSubscriber type "${type}"`)
  }

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
        const label = `SocketSubscriber(${type})`
        if (process.env.NODE_ENV === 'development') {
          console.log(`connecting ${label} ${id}...`)
        }
        socket.post(socketUrl(`/noo/${type}/${id}/subscribe`), (body, jwr) => {
          if (!isEqual(body, {})) {
            rollbar.error(`Failed to connect ${label}: ${body}`)
          }
        })
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
