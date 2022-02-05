import * as v from '../src/validators'

describe('hasDisallowedCharacters', () => {
  it('catches characters on the blacklist', () => {
    expect(v.hasDisallowedCharacters('#%')('flargle%wargle')).not.toBe(null)
  })

  it('allows strings with no blacklisted characters', () => {
    expect(v.hasDisallowedCharacters('%$')('flarglewargle!')).toBe(null)
  })
})

describe('hasWhitespace', () => {
  it('catches combination of tab and space characters', () => {
    expect(v.hasWhitespace('so much 	    	     space')).not.toBe(null)
  })

  it('allows strings with no whitespace', () => {
    expect(v.onlyWhitespace('notsomuchspace')).toBe(null)
  })
})

describe('onlyWhitespace', () => {
  it('catches combination of tab and space characters', () => {
    expect(v.onlyWhitespace(' 	    	     ')).not.toBe(null)
  })

  it('allows strings with whitespace', () => {
    expect(v.onlyWhitespace('flargle wargle argle bargle -----')).toBe(null)
  })
})

describe('lengthGreaterThan', () => {
  it('catches strings longer than max', () => {
    expect(v.lengthGreaterThan(10)('01234567890')).not.toBe(null)
  })

  it('allows strings equal to max', () => {
    expect(v.lengthGreaterThan(10)('0123456789')).toBe(null)
  })

  it('allows strings less than max', () => {
    expect(v.lengthGreaterThan(10)('012345678')).toBe(null)
  })
})

describe('lengthLessThan', () => {
  it('catches strings less than min', () => {
    expect(v.lengthLessThan(2)('0')).not.toBe(null)
  })

  it('allows strings equal to min', () => {
    expect(v.lengthLessThan(2)('01')).toBe(null)
  })

  it('allows strings greater than min', () => {
    expect(v.lengthLessThan(2)('012')).toBe(null)
  })
})

describe('notHyloUrl', () => {
  it('catches URLs without hylo.com', () => {
    expect(v.notHyloUrl('https://google.co.nz')).not.toBe(null)
  })

  it('allows hylo.com subdomains', () => {
    expect(v.notHyloUrl('https://flargle.hylo.com')).toBe(null)
  })
})

describe('isRelativePath', () => {
  it('catches a current directory path', () => {
    expect(v.isRelativePath('./floof')).not.toBe(null)
  })

  it('catches a previous directory path', () => {
    expect(v.isRelativePath('../floof')).not.toBe(null)
  })

  it('catches two leading dots', () => {
    expect(v.isRelativePath('..')).not.toBe(null)
  })

  it('allows non-consecutive dots', () => {
    expect(v.isRelativePath('this.is.separated.by.dots')).toBe(null)
  })
})

describe('validateUser', () => {
  describe('password', () => {
    it('catches combination of tab and space characters', () => {
      expect(v.validateUser.password(' 	    	     ')).not.toBe(null)
    })

    it('catches short passwords', () => {
      expect(v.validateUser.password('aaa')).not.toBe(null)
    })

    it('allows good passwords', () => {
      expect(v.validateUser.password('4#V;^9wLt6z G2CYa')).toBe(null)
    })
  })

  describe('name', () => {
    it('catches combination of tab and space characters', () => {
      expect(v.validateUser.name(' 	    	     ')).not.toBe(null)
    })
  })
})

describe('validateFlaggedItem', () => {
  describe('reason', () => {
    it('catches combination of tab and space characters', () => {
      expect(v.validateFlaggedItem.reason(' 	    	     ')).not.toBe(null)
    })

    it('rejects very long strings', () => {
      const longString = new Array(10000).join('a')
      expect(v.validateFlaggedItem.reason(longString)).not.toBe(null)
    })
  })

  describe('link', () => {
    it('accepts Hylo subdomains', () => {
      expect(v.validateFlaggedItem.link('https://legacy.hylo.com/foo/bar')).toBe(null)
    })

    it('rejects other domains', () => {
      expect(v.validateFlaggedItem.link('https://flargleargle.org/borf/spoon')).not.toBe(null)
    })
  })
})

describe('validateTopicName', () => {
  it('rejects very long names', () => {
    const longString = new Array(1000).join('a')
    expect(v.validateTopicName(longString)).not.toBe(null)
  })

  it('rejects single character names', () => {
    expect(v.validateTopicName('x')).not.toBe(null)
  })

  it('rejects topics with whitespace', () => {
    expect(v.validateTopicName('a silly topic')).not.toBe(null)
  })

  it('rejects topics with hashtags', () => {
    expect(v.validateTopicName('#hashhash')).not.toBe(null)
  })

  it('allows sensible topics', () => {
    expect(v.validateTopicName('this-is-more-like-it')).toBe(null)
  })
})
