import { compact } from 'lodash'
import { isURL } from 'validator'

// Validators return a string describing the error if invalid, or null if valid.
export const hasDisallowedCharacters = blacklist => {
  return s => new RegExp(`[${blacklist}]`).exec(s)
    ? `must not contain any of ${blacklist}`
    : null
}

// This is an anti-relative path rule, just trying to avoid the jargon
export const isRelativePath = s => /^\.\.?\/?/.exec(s) ? 'must not start with periods' : null

export const hasWhitespace = s => /\s/.exec(s) ? 'must not contain whitespace' : null

export const onlyWhitespace = s => s.trim() === '' ? 'must not consist solely of whitespace' : null

export const lengthGreaterThan = length => s => s.length > length ? `must be no more than ${length} characters` : null

export const lengthLessThan = length => s => s.length < length ? `must be at least ${length} characters` : null

export const notHyloUrl = link => !isURL(link, { host_whitelist: [ /.*hylo\.com/ ] }) ? 'must be a valid Hylo URL' : null

export const validateUser = {
  password (password) {
    if (typeof password !== 'string') return 'Password must be a string'
    const validators = [ onlyWhitespace, lengthLessThan(9) ]
    const invalidReasons = compact(validators.map(validator => validator(password)))
    return invalidReasons.length ? `Password ${invalidReasons.join(', ')}.` : null
  },

  // Note: the user's full name, _not_ a login field (we use email for that)
  name (name) {
    if (typeof name !== 'string') return 'Name must be a string.'
    const validators = [ onlyWhitespace ]
    const invalidReasons = compact(validators.map(validator => validator(name)))
    return invalidReasons.length ? `Name ${invalidReasons.join(', ')}.` : null
  }
}

export const validateFlaggedItem = {
  reason (reason) {
    if (typeof reason !== 'string') return 'Reason must be a string.'
    const validators = [ onlyWhitespace, lengthGreaterThan(5000) ]
    const invalidReasons = compact(validators.map(validator => validator(reason)))
    return invalidReasons.length ? `Reason ${invalidReasons.join(', ')}.` : null
  },

  link (link) {
    if (typeof link !== 'string') return 'Link must be a string.'
    const validators = [ notHyloUrl ]
    const invalidReasons = compact(validators.map(validator => validator(link)))
    return invalidReasons.length ? `Link ${invalidReasons.join(', ')}.` : null
  }
}

export const validateTopicName = name => {
  if (typeof name !== 'string') return 'Topic name must be a string.'
  const validators = [
    hasDisallowedCharacters('#/'),
    isRelativePath,
    hasWhitespace,
    lengthGreaterThan(40),
    lengthLessThan(2)
  ]
  const invalidReasons = compact(validators.map(validator => validator(name)))
  return invalidReasons.length ? `Topic name ${invalidReasons.join(', ')}.` : null
}
