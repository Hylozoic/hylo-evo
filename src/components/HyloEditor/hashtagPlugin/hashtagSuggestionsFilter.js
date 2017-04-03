const hashtagSuggestionFilter = (searchValue, issues) => {
  console.log(issues.get(0).get('id'))
  const lowerSearch = searchValue.toLowerCase()
  return issues.filter(i => String(i.get('id')).startsWith(lowerSearch) ||
                            i.get('subject').replace(/\s+/g, '').toLowerCase().indexOf(lowerSearch) !== -1)
               .take(5)
}

export default hashtagSuggestionFilter
