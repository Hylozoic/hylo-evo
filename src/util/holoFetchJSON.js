// FIX: dependency causing troubles so removing for now
//
// "@holochain/hc-web-client": "https://github.com/holochain/hc-web-client#call-raw"
//
import { connect } from '@holochain/hc-web-client'

var call

export default async function holoFetchJSON (path, params) {
  if (!call) {
    const connection = await connect(process.env.HOLO_CHAT_API_HOST)
    call = connection.call
  }

  return call(path)(params)
}
