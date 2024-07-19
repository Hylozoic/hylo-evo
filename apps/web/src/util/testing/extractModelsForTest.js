import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'

export default function extractModelsForTest (data, extractModel = {}, ormSession) {
  extractModelsFromAction({
    payload: {
      data
    },
    meta: {
      extractModel
    }
  }, ormSession)
}
