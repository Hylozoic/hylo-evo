/*
  The farm profile schema is a evolving schema outside the direct management of Hylo. 
  The below selector functions will be used to mitigate the risk of changes to that schema.
  If the external schema needs to change, if we only reference it here, in one place,
  we will have minimal places to make changes to ensure things don't break.
  To that end, avoid directly referencing properites on the data structure;
  like `farmData.product_categories`
*/

import getFarmData from 'store/selectors/getFarmData'

export function getAnimalProducts (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.products_animals) return []
  return farmData.products_animals
}

export function getAverageAnnualRainfall (group) { // value *always* stored in metric, so millimeters
  const farmData = getFarmData(group)
  if (!farmData || !farmData.average_annual_rainfall) return null
  return farmData.average_annual_rainfall
}

export function getAverageAnnualTemperature (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.average_annual_temperature) return null
  return farmData.average_annual_temperature
}

export function getClimateZone (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.climate_zone) return null
  return farmData.climate_zone
}

export function getConditionsDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.conditions_detail) return {}
  return farmData.conditions_detail
}

export function getContactEmail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.email) return null
  return farmData.email
}

export function getContactName (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.name) return null
  return farmData.name
}

export function getContactPhone (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.phone) return null
  return farmData.phone
}

export function getFarmAddress (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.location) return {}
  return farmData.location
}

export function getCounty (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.county) return null
  return farmData.county
}

export function getCertifitcationsCurrent (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.certifications_current) return null
  return farmData.certifications_current
}

export function getCertifitcationsCurrentDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.certifications_current_detail) return []
  return farmData.certifications_current_detail
}

export function getManagementPlansCurrent (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.management_plans_current) return null
  return farmData.management_plans_current
}

export function getManagementPlansCurrentDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.management_plans_current_detail) return []
  return farmData.management_plans_current_detail
}

export function getCertifitcationsFuture (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.certifications_future) return null
  return farmData.certifications_future
}

export function getCertifitcationsFutureDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.certifications_future_detail) return []
  return farmData.certifications_future_detail
}

export function getManagementPlansFuture (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.management_plans_future) return null
  return farmData.management_plans_future
}

export function getManagementPlansFutureDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.management_plans_future_detail) return []
  return farmData.management_plans_future_detail
}

export function getEquityPractices (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.equity_practices) return []
  return farmData.equity_practices
}

export function getFarmLeadershipExperience (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.farm_leadership_experience) return null
  return farmData.farm_leadership_experience
}

export function getArea (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.area_total_hectares) return null
  return farmData.area_total_hectares
}

export function getWebsite (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.website) return null
  return farmData.website
}

export function getFarmOutlineGeo (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.area) return null
  return farmData.area
}

export function getHardinessZone (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.hardiness_zone) return null
  return farmData.hardiness_zone
}

export function getIndigenousTerritory (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.indigenous_territory) return null
  return farmData.indigenous_territory
}

export function getFarmOpportunities (group) {
  const farmData = getFarmData(group)
  return farmData.interest || []
}

export function getProductsAndLandUse (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.products_categories) return []
  return farmData.products_categories
}

export function getLandUseDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.land_type_detail) return {}
  return farmData.land_type_detail
}

export function getMailingAddress (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.mailing_address) return null
  return farmData.mailing_address
}

export function getMotivations (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.motivations) return []
  return farmData.motivations
}

export function getOperationTypes (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.types) return []
  return farmData.types
}

export function getOrganizationId (group) { // country specific business id
  const farmData = getFarmData(group)
  if (!farmData || !farmData.organization_id) return null
  return farmData.organization_id
}

export function getOrganizationName (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.organization) return null
  return farmData.organization
}

export function getLandOwnership (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.land_other) return []
  return farmData.land_other
}

export function getLandOwnershipDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.land_other_detail) return {}
  return farmData.land_other_detail
}

export function getBio (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.bio) return null
  return farmData.bio
}

export function getPreferredContactMethod (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.preferred) return null
  return farmData.preferred
}

export function getProducerCommunityOutlineGeo (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.area_community) return null
  return farmData.area_community
}

export function getProductDetail (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.product_detail) return []
  return farmData.product_detail
}

export function getProductsValueAdded (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.products_value_added) return []
  return farmData.products_value_added
}

export function getSchemaVersion (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.schema_version) return []
  return farmData.schema_version
}

export function getSocialMedia (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.social) return null
  return farmData.social
}

export function getAnimalTotalCount (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.animals_total) return null
  return farmData.animals_total
}

export function getAnimalCountByType (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.animals_detail) return null
  return farmData.animals_detail
}

export function getUnitPreference (group) {
  const farmData = getFarmData(group)
  if (!farmData || !farmData.units) return 'metric'
  return farmData.units
}

/*
  Hylo sub-profile specific selectors
*/

export function getHyloSpecificFarmSchemaData (farmData) {
  if (!farmData || !farmData.flexible || !farmData.flexible.hylo) return {}
  return farmData.flexible.hylo
}

export function getOpenToPublic (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.open_to_public
}

export function getAtAGlance (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.at_a_glance || []
}

export function getLocationPrivacy (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.location_privacy || 'precise'
}

export function getMission (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.mission || null
}

export function getPublicOfferings (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.public_offerings || []
}

export function getOpeningHours (group) {
  const farmData = getFarmData(group)
  const data = getHyloSpecificFarmSchemaData(farmData)
  return data.opening_hours || null
}
