import { connect } from '@holochain/hc-web-client'

var call

export default async function holoFetchJSON (path, params) {
  if (!call) {
    const connection = await connect(process.env.HOLO_CHAT_API_HOST)
    call = connection.call
  }

  return call(path)(params)
}
