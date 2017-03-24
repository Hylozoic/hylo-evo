export const postParser = {
  isValid (post) {
    const requiredProperties = [
      'id',
      'title',
      'details',
      'type'
    ]
    return requiredProperties.find(p => !post.hasOwnProperty(p)) ? false : true
  },

  parse (post) {
    return post
  }
}

