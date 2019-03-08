const test = require('tape');

const { Config, Container } = require('@holochain/holochain-nodejs')

const dnaPath = "dist/bundle.json"

module.exports = () => {
  const container = (() => {
    const agentAlice = Config.agent("alice")
    const agentBob = Config.agent("bob")

    const dna = Config.dna(dnaPath)

    const instanceAlice = Config.instance(agentAlice, dna)
    const instanceBob = Config.instance(agentBob, dna)

    const containerConfig = Config.container([instanceAlice, instanceBob])
    return new Container(containerConfig)
  })()

  // Initialize the Container
  container.start()

  const alice = container.makeCaller('alice', dnaPath)
  const bob = container.makeCaller('bob', dnaPath)

  test('Can see other agents', (t) => {
    const result_ = app.call("chat", "main", "graphql", {
      query: "query { apiVersion }",
      variables: {}
    })
    console.log(result_)
    t.equal(result_.Ok, '{"apiVersion":"0.0.1"}')
    t.end()
  })
}
