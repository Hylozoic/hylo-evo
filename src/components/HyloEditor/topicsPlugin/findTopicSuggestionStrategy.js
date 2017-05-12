import findWithRegex from 'find-with-regex'

const TOPIC_REGEX = /(\s|^)#[^\s]*/g

export default (contentBlock, callback) => {
  findWithRegex(TOPIC_REGEX, contentBlock, callback)
}
