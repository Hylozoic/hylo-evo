/* global API_URI, GRAPHQL_URI */

const api = page => ({
  async apiRequest (uri, payload) {
    await page.setRequestInterception(true)
    page.once('request', request =>
      request.continue({
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        postData: JSON.stringify(payload)
      })
    )
    const res = await page.goto(uri)
    await page.setRequestInterception(false)
    return JSON.parse(await res.text())
  },

  async graphql (action) {
    return this.apiRequest(GRAPHQL_URI, action.graphql)
  },

  async logout () {
    return page.goto(`${API_URI}/noo/logout`)
  },

  async request (endpoint, json) {
    return this.apiRequest(`${API_URI}${endpoint}`, json)
  }
})

export default api
