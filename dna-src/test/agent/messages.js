const queries = require('../queries')
module.exports = (scenario) => {

scenario.runTape('Can register a user and retrieve them again', async (t, {alice}) => {
    let register_response = alice.call("chat", "graphql", {
      query: queries.registerQuery,
      variables: {id: "000", name: "wollum", avatarUrl: "//"}
    })
    console.log(register_response)

    // add a thread
    const add_result = alice.call("chat", "graphql", {
      query: queries.findOrCreateThreadQuery,
      variables: {participantIds: []}
    })
    let threadId = JSON.parse(add_result.Ok).findOrCreateThread.id
    t.equal(threadId.length, 46) // thread was created and hash returned

    const post_result = alice.call("chat", "graphql", {
      query: queries.createMessageQuery,
      variables: {messageThreadId: threadId, text: "Hello hylo+holo!"}
    })
    console.log(post_result)
    // t.notEqual(JSON.parse(post_result.Ok).createMessage.text, "Hello hylo+holo!")

    // retrieve message from channel
    alice.call("chat", "graphql", {
      query: queries.getMessagesQuery,
      variables: {id: threadId, cursor: "0"}
    })
    alice.call("chat", "graphql", {
      query: queries.getMessagesQuery,
      variables: {id: threadId, cursor: "0"}
    })
    const get_result = alice.call("chat", "graphql", {
      query: queries.getMessagesQuery,
      variables: {id: threadId, cursor: "0"}
    })
    console.log(get_result)
    t.equal(JSON.parse(get_result.Ok).messageThread.messages.total, 1)
    t.equal(JSON.parse(get_result.Ok).messageThread.messages.items[0].text, "Hello hylo+holo!")

  })
}
