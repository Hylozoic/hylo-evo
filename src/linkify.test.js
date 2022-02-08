import linkify from './linkify'

it('works correctly', () => {
  const source = 'hello! http://foo.com and foo@bar.com and ' +
    '<a href="/bar" data-id="3" target="_blank">bar</a> ' +
    '<a href="https://foo.com/bar">ok</a> great'

  const expected = 'hello! <a href="http://foo.com" class="linkified" ' +
    'target="_blank">http://foo.com</a> and ' +
    '<a href="mailto:foo@bar.com" class="linkified">foo@bar.com</a> and ' +
    '<a href="/bar" data-id="3" target="_blank">bar</a> ' +
    '<a href="https://foo.com/bar">ok</a> great'

  expect(linkify(source)).toEqual(expected)
})

it('handles <br> tags correctly', () => {
  const source = '<p>hi<br><br>ok</p>'
  const expected = '<p>hi<br><br>ok</p>'
  expect(linkify(source)).toEqual(expected)
})

it('wraps unlinked hashtags', () => {
  const source = '<p>and #foo</p>'
  const expected = '<p>and <a href="/all/topics/foo" class="hashtag" data-search="#foo">#foo</a></p>'
  expect(linkify(source)).toEqual(expected)
})

it('wraps unlinked hashtags with underscores', () => {
  const source = '<p>and #foo_bar</p>'
  const expected = '<p>and <a href="/all/topics/foo_bar" class="hashtag" data-search="#foo_bar">#foo_bar</a></p>'
  expect(linkify(source)).toEqual(expected)
})

it('adds group slug when wrapping unlinked hashtags', () => {
  const source = '<p>and #foo</p>'
  const slug = 'bar'
  const expected = '<p>and <a href="/groups/bar/topics/foo" class="hashtag" data-search="#foo">#foo</a></p>'
  expect(linkify(source, slug)).toEqual(expected)
})

it('adds attributes to linked hashtags', () => {
  const source = '<p>and <a>#foo</a></p>'
  const expected = '<p>and <a href="/all/topics/foo" data-search="#foo" class="hashtag">#foo</a></p>'
  expect(linkify(source)).toEqual(expected)
})

it('adds attributes to linked hashtags, including group slug if present', () => {
  const source = '<p>and <a>#foo-bar</a></p>'
  const slug = 'yes'
  const expected = '<p>and <a href="/groups/yes/topics/foo-bar" data-search="#foo-bar" class="hashtag">#foo-bar</a></p>'
  expect(linkify(source, slug)).toEqual(expected)
})

it('does not linkify hash fragments in URLs as hashtags', () => {
  const source = '<p>ok http://foo.com/#bar yes?</p>'
  const expected = '<p>ok <a href="http://foo.com/#bar" class="linkified" target="_blank">http://foo.com/#bar</a> yes?</p>'
  expect(linkify(source)).toEqual(expected)
})

it('shortens long URLs', () => {
  const longUrl = 'http://www.nirandfar.com/2016/07/three-steps-get-speed-subject-quickly.html?goal=0_9f67e23487-01de31333b-97733697&mc_cid=01de31333b&mc_eid=edfd8b3847'
  const shortUrl = longUrl.slice(0, 48)
  const source = `<p>${longUrl} and <a href="meow">${longUrl}</a></p>`
  const expected = `<p><a href="${longUrl}" class="linkified" target="_blank">${shortUrl + '…'}</a> and <a href="meow">${shortUrl}…</a></p>`
  expect(linkify(source)).toEqual(expected)
})
