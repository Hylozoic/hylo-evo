import { attr, Model } from 'redux-orm'

class SearchResult extends Model {
  toString () {
    return `SearchResult: ${this.id}`
  }

  getContent (session) {
    const [ type, id ] = this.content.split('-')
    return session[type].withId(id)
  }
}

export default SearchResult

SearchResult.modelName = 'SearchResult'
SearchResult.fields = {
  id: attr(),
  // this is a polymorphicId, see getContent above
  content: attr()
}
