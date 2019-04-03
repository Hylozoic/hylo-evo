import { connect } from '@holochain/hc-web-client'

export default function holoFetchJSON (path, params) {
  return connect(process.env.HOLO_CHAT_API_HOST)
    .then(connection => connection.call(path)(params))
}
