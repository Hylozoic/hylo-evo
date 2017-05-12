import findWithRegex from 'find-with-regex'

const HASHTAG_REGEX = /(\s|^)#[^\s]*/g

export default (contentBlock, callback) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}
