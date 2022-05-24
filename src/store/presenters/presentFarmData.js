export const areaToRange = (area, unit) => {
  if (!area || typeof area !== 'number') return null
  if (area < 0.5) return unit === 'acres' ? 'Less than an acre' : 'Less than half a hectare'
  if (area <= 2) return unit === 'acres' ? '1-5 acres' : '0.5-2 hectares'
  if (area <= 8) return unit === 'acres' ? '5-20 acres' : '2-8 hectares'
  if (area <= 20) return unit === 'acres' ? '20-50 acres' : '8-20 hectares'
  if (area <= 40) return unit === 'acres' ? '50-100 acres' : '20-40 hectares'
  if (area <= 200) return unit === 'acres' ? '100-500 acres' : '40-200 hectares'
  if (area <= 400) return unit === 'acres' ? '500-1000 acres' : '200-400 hectares'
  if (area <= 2000) return unit === 'acres' ? '1000-5000 acres' : '400-2000 hectares'
  if (area <= 4000) return unit === 'acres' ? '5000-10000 acres' : '2000-4000 hectares'
  if (area <= 20000) return unit === 'acres' ? '10000-50000 acres' : '4000-20000 hectares'
  return unit === 'acres' ? '50000+ acres' : '20000+ hectares'
}

export const animalCountToRange = (animalCount) => {
  if (!animalCount || typeof animalCount !== 'number') return null
  if (animalCount < 10) return '0-10'
  if (animalCount <= 100) return '11-100'
  if (animalCount <= 300) return '101-300'
  if (animalCount <= 1000) return '301-1000'
  if (animalCount <= 5000) return '1001-5000'
  if (animalCount <= 10000) return '5001-10000'
  if (animalCount <= 100000) return '10000-100000'
  return '100000+'
}
