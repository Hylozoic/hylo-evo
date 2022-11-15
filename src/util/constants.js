export const MAX_POST_TOPICS = 3

export const STREAM_SORT_OPTIONS = [
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'reactions', label: 'Popular' }
]

export const COLLECTION_SORT_OPTIONS = [
  { id: 'order', label: 'Manual' },
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'reactions', label: 'Popular' }
]

export const STARTED_TYPING_INTERVAL = 3000
export const ALL_VIEW = 'all'
export const FARM_VIEW = 'farm'
export const FARM_ONBOARDING = 'farm-onboarding'

export const ANIMAL_LIST = [
  { label: 'Dairy Cattle', value: 'dairy_cattle' },
  { label: 'Beef Cattle', value: 'beef_cattle' },
  { label: 'Hogs & Pigs', value: 'hogs_pigs' },
  { label: 'Goats', value: 'goats' },
  { label: 'Sheep', value: 'sheep' },
  { label: 'Horses, donkeys and other equine', value: 'equine' },
  { label: 'Poultry', value: 'poultry' },
  { label: 'Aquaculture', value: 'aquaculture' },
  { label: 'Bison', value: 'bison' },
  { label: 'Bee Colonies', value: 'bee_colony' },
  { label: 'Llama', value: 'llama' }
]

export const COLLABORATION_INTERESTS = [
  {
    value: 'research',
    label: 'Research'
  },
  {
    value: 'events',
    label: 'Cohosting events'
  },
  {
    value: 'volunteering',
    label: 'Volunteering opportunities'
  },
  {
    value: 'mentorship',
    label: 'Offering mentorship & advice'
  },
  {
    value: 'cooperative',
    label: 'Cooperative and supply-chain development'
  },
  {
    value: 'buy',
    label: 'Buy our products'
  },
  {
    value: 'markets',
    label: 'Access to new markets'
  },
  {
    value: 'ecosystem_service_markets',
    label: 'Access to ecosystem service markets'
  },
  {
    value: 'loans',
    label: 'Low-cost loans'
  },
  {
    value: 'support',
    label: 'Farm support opportunities'
  },
  {
    value: 'equipment_sharing',
    label: 'Equipment sharing'
  },
  {
    value: 'increase_sales',
    label: 'Increasing sales'
  },
  {
    value: 'communication',
    label: 'Communication & marketing'
  },
  {
    value: 'new_products_methods',
    label: 'New methods & practices'
  },
  {
    value: 'carbon',
    label: 'Carbon markets'
  },
  {
    value: 'environmental_impact',
    label: 'Environmental impact'
  },
  {
    value: 'benchmarking',
    label: 'Benchmarking'
  },
  {
    value: 'insetting',
    label: 'Insetting'
  },
  {
    value: 'reduce_risk',
    label: 'Hazard risk mitigation'
  },
  {
    value: 'farm_valuation',
    label: 'Farm valuation'
  },
  {
    value: 'certifications',
    label: 'Certifications'
  },
  {
    value: 'food_nutrition',
    label: 'Nutrient density'
  },
  {
    value: 'biodiversity',
    label: 'Biodiversity'
  },
  {
    value: 'product_quality',
    label: 'Product quality'
  },
  {
    value: 'animal_welfare',
    label: 'Animal welfare'
  }
]

export const MANAGEMENT_PLANS = [
  {
    label: 'Carbon Farm Plan',
    value: 'carbon_farm',
    id: '6082c564ad98c70001bdea70'
  },
  {
    label: 'Habitat Plan',
    value: 'habitat_plan',
    id: '6082c564ad98c70001bdea71'
  },
  {
    label: 'Holistic Grazing Plan',
    value: 'holistic_grazing',
    id: '6082c564ad98c70001bdea72'
  },
  {
    label: 'Holistic/Whole Farm Plan',
    value: 'holistic_farm',
    id: '6082c564ad98c70001bdea73'
  },
  {
    label: 'Integrated Pest Management Plan',
    value: 'ipm',
    id: '6082c564ad98c70001bdea74'
  },
  {
    label: 'Irrigation Water Management Plan',
    value: 'irrigation_management',
    id: '6082c564ad98c70001bdea75'
  },
  {
    label: 'Landscape Conservation Plan',
    value: 'landscape_conservation',
    id: '6082c564ad98c70001bdea76'
  },
  {
    label: 'Non-NRCS Conservation Plan',
    value: 'non_nrcs_conservation',
    id: '6082c564ad98c70001bdea77'
  },
  {
    label: 'NRCS Conservation Plan',
    value: 'nrcs_conservation',
    id: '6082c564ad98c70001bdea78'
  },
  {
    label: 'Nutrient Management Plan',
    value: 'nutrient_management',
    id: '6082c564ad98c70001bdea79'
  },
  {
    label: 'Organic Systems Plan',
    value: 'organic_systems',
    id: '6082c564ad98c70001bdea7a'
  },
  {
    label: 'Phosphorous Management Tool',
    value: 'phosphorous_management_tool',
    id: '6082c564ad98c70001bdea7b'
  },
  {
    label: 'Soil and Water Conservation Plan',
    value: 'soil_water_conservation',
    id: '6082c564ad98c70001bdea7c'
  },
  {
    label: 'Soil Health Management Plan',
    value: 'soil_health_management',
    id: '6082c564ad98c70001bdea7d'
  },
  {
    label: 'US Fish and Wildlife Private Lands Program',
    value: 'us_fish_wildlife',
    id: '6082c564ad98c70001bdea7e'
  }
]

export const FARM_TYPES = [
  {
    value: 'wholesale_farm',
    label: 'Commerical wholesale'
  },
  {
    value: 'directsale_farm',
    label: 'Commercial direct to consumer'
  },
  {
    value: 'nonprofit_farm',
    label: 'Non-profit'
  },
  {
    value: 'education_farm',
    label: 'Education farm'
  },
  {
    value: 'research_farm',
    label: 'Research or experimental farm'
  },
  {
    value: 'cooperative_farm',
    label: 'Cooperative or Community Farm'
  },
  {
    value: 'market_garden',
    label: 'Market garden'
  },
  {
    value: 'home_garden',
    label: 'Home garden/Farmstead'
  },
  {
    value: 'nursery_farm',
    label: 'Nursery Farm'
  },
  {
    value: 'community_garden',
    label: 'Community Garden'
  }
]

export const FARM_GOALS = [
  {
    value: 'profitability',
    label: 'Profitability'
  },
  {
    value: 'risk_minimization',
    label: 'Risk Minimization'
  },
  {
    value: 'soil_biology',
    label: 'Soil Biology'
  },
  {
    value: 'soil_fertility',
    label: 'Soil Fertility (chemistry)'
  },
  {
    value: 'soil_structure',
    label: 'Soil Structure'
  },
  {
    value: 'environmental_stewardship',
    label: 'Environmental Stewardship'
  },
  {
    value: 'product_quality',
    label: 'Product Quality'
  }
]

export const HARDINESS_ZONES = [
  '1a',
  '1b',
  '2a',
  '2b',
  '3a',
  '3b',
  '4a',
  '4b',
  '5a',
  '5b',
  '6a',
  '6b',
  '7a',
  '7b',
  '8a',
  '8b',
  '9a',
  '9b',
  '10a',
  '10b',
  '11a',
  '11b',
  '12a',
  '12b',
  '13a',
  '13b'
]

export const FARM_MOTIVATIONS = [
  {
    value: 'lifestyle',
    label: 'Lifestyle'
  },
  {
    value: 'family_farm',
    label: 'Family farm'
  },
  {
    value: 'love_nature',
    label: 'Love nature'
  },
  {
    value: 'feeding_others',
    label: 'Feeding others'
  },
  {
    value: 'paid_work',
    label: 'Paid work'
  },
  {
    value: 'be_productive',
    label: 'Be Productive'
  },
  {
    value: 'community',
    label: 'Enjoy or support my community'
  },
  {
    value: 'save_the_world',
    label: 'Save the world'
  },
  {
    value: 'research',
    label: 'Research'
  },
  {
    value: 'education',
    label: 'Teach'
  },
  {
    value: 'responsible_use',
    label: 'Responsible use of land'
  }
]

export const PREFERRED_CONTACT_METHODS = [
  {
    value: 'phone',
    label: 'Phone'
  },
  {
    value: 'text',
    label: 'Text message'
  },
  {
    value: 'email',
    label: 'Email'
  },
  {
    value: 'mail',
    label: 'Regular mail'
  }
]

export const PRODUCT_CATEGORIES = [
  {
    value: 'grains_other',
    label: 'Grains and other row crops'
  },
  {
    value: 'vegetables',
    label: 'Vegetables'
  },
  {
    value: 'berries',
    label: 'Small fruit / berries'
  },
  {
    value: 'native_habitat',
    label: 'Native Habitat (low / no management)'
  },
  {
    value: 'hay_alfalfa',
    label: 'Hay / alfalfa'
  },
  {
    value: 'orchard_vine',
    label: 'Orchard and Vine Crops'
  },
  {
    value: 'rangeland',
    label: 'Rangeland'
  },
  {
    value: 'pasture',
    label: 'Pasture'
  },
  {
    value: 'dairy',
    label: 'Dairy'
  },
  {
    value: 'aquaculture',
    label: 'Aquaculture'
  },
  {
    value: 'agroforestry',
    label: 'Agroforestry'
  },
  {
    value: 'wool',
    label: 'Wool'
  },
  {
    value: 'feed_lot',
    label: 'Feed Lots'
  },
  {
    value: 'live_animal_sales_domestic',
    label: 'Live Animal Sales, Domestic'
  },
  {
    value: 'live_animal_sales_export',
    label: 'Live Animal Sales, Export'
  }
]

export const LOCATION_PRIVACY = [
  {
    label: 'Precise',
    value: 'precise'
  },
  {
    label: 'Near',
    value: 'near'
  },
  {
    label: 'Region',
    value: 'region'
  }
]

export const PUBLIC_OFFERINGS = [
  {
    value: 'farmstand',
    label: 'Farmstand'
  },
  {
    value: 'shop',
    label: 'Shop'
  },
  {
    value: 'upick',
    label: 'U-pick produce'
  },
  {
    value: 'workshops',
    label: 'Workshops'
  },
  {
    value: 'events',
    label: 'Events'
  },
  {
    value: 'tours',
    label: 'Tours'
  }
]

export const CLIMATE_ZONES = [
  {
    value: 'Af',
    label: 'Tropical - Rainforest',
    id: '61c38d780b04e80001e1a113'
  },
  {
    value: 'Am',
    label: 'Tropical - Monsoon',
    id: '61c38d780b04e80001e1a114'
  },
  {
    value: 'Aw',
    label: 'Tropical - Savanna, Dry winter',
    id: '61c38d780b04e80001e1a115'
  },
  {
    value: 'As',
    label: 'Tropical - Savanna, Dry summer',
    id: '61c38d780b04e80001e1a116'
  },
  {
    value: 'BWh',
    label: 'Arid - Desert, Hot',
    id: '61c38d780b04e80001e1a117'
  },
  {
    value: 'BWk',
    label: 'Arid - Desert, Cold',
    id: '61c38d780b04e80001e1a118'
  },
  {
    value: 'BSh',
    label: 'Arid - Steppe, Hot',
    id: '61c38d780b04e80001e1a119'
  },
  {
    value: 'BSk',
    label: 'Arid - Steppe, Cold',
    id: '61c38d780b04e80001e1a11a'
  },
  {
    value: 'Csa',
    label: 'Temperate - Hot Dry Summer',
    id: '61c38d780b04e80001e1a11b'
  },
  {
    value: 'Csb',
    label: 'Temperate - Warm Dry Summer',
    id: '61c38d780b04e80001e1a11c'
  },
  {
    value: 'Csc',
    label: 'Temperate - Cold Dry Summer',
    id: '61c38d780b04e80001e1a11d'
  },
  {
    value: 'Cwa',
    label: 'Temperate - Dry Winter, Hot Summer',
    id: '61c38d780b04e80001e1a11e'
  },
  {
    value: 'Cwb',
    label: 'Temperate - Dry Winter, Warm Summer',
    id: '61c38d780b04e80001e1a11f'
  },
  {
    value: 'Cwc',
    label: 'Temperate - Dry Winter, Cool Summer',
    id: '61c38d780b04e80001e1a120'
  },
  {
    value: 'Cfa',
    label: 'Temperate - Hot Summer, No Dry Season',
    id: '61c38d780b04e80001e1a121'
  },
  {
    value: 'Cfb',
    label: 'Temperate - Warm Summer, No Dry Season',
    id: '61c38d780b04e80001e1a122'
  },
  {
    value: 'Cfc',
    label: 'Temperate - Cool Summer, No Dry Season',
    id: '61c38d780b04e80001e1a123'
  },
  {
    value: 'Dsa',
    label: 'Continental - Hot Dry Summer',
    id: '61c38d780b04e80001e1a124'
  },
  {
    value: 'Dsb',
    label: 'Continental - Warm Dry Summer',
    id: '61c38d780b04e80001e1a125'
  },
  {
    value: 'Dsc',
    label: 'Continental - Cold Dry Summer',
    id: '61c38d780b04e80001e1a126'
  },
  {
    value: 'Dsd',
    label: 'Continental - Dry Summer, Very Cold Winter',
    id: '61c38d780b04e80001e1a127'
  },
  {
    value: 'Dwa',
    label: 'Continental - Dry Winter, Hot Summer',
    id: '61c38d780b04e80001e1a128'
  },
  {
    value: 'Dwb',
    label: 'Continental - Dry Winter, Warm Summer',
    id: '61c38d780b04e80001e1a129'
  },
  {
    value: 'Dwc',
    label: 'Continental - Dry Winter, Cool Summer',
    id: '61c38d780b04e80001e1a12a'
  },
  {
    value: 'Dwd',
    label: 'Continental - Dry, Very Cold Winter',
    id: '61c38d780b04e80001e1a12b'
  },
  {
    value: 'Dfa',
    label: 'Continental - Hot Summer, No Dry Season',
    id: '61c38d780b04e80001e1a12c'
  },
  {
    value: 'Dfb',
    label: 'Continental - Warm Summer, No Dry Season',
    id: '61c38d780b04e80001e1a12d'
  },
  {
    value: 'Dfc',
    label: 'Continental - Cool Summer, No Dry Season',
    id: '61c38d780b04e80001e1a12e'
  },
  {
    value: 'Dfd',
    label: 'Continental - Very Cold Winter, No Dry Season',
    id: '61c38d780b04e80001e1a12f'
  },
  {
    value: 'ET',
    label: 'Tundra',
    id: '61c38d780b04e80001e1a130'
  },
  {
    value: 'EF',
    label: 'Eternal frost (ice cap)',
    id: '61c38d780b04e80001e1a131'
  }
]

export const FARM_CERTIFICATIONS = [
  {
    label: 'American Grassfed Association',
    value: 'american_grassfed',
    id: '6082c53bad98c70001bdea2e'
  },
  {
    label: 'American Wool Assurance Standard',
    value: 'american_wool',
    id: '6082c53bad98c70001bdea2f'
  },
  {
    label: 'Animal Welfare Certified',
    value: 'animal_welfare',
    id: '6082c53bad98c70001bdea30'
  },
  {
    label: 'Audubon Bird Friendly',
    value: 'audubon_bird',
    id: '6082c53bad98c70001bdea31'
  },
  {
    label: 'Bee Friendly Farming',
    value: 'bee_friendly',
    id: '6082c53bad98c70001bdea32'
  },
  {
    label: 'Beef/Pork Quality Assurance',
    value: 'beef_pork_quality',
    id: '6082c53bad98c70001bdea33'
  },
  {
    label: 'California Sustainable Winegrowing Program',
    value: 'california_sust_winegrowing',
    id: '6082c53bad98c70001bdea34'
  },
  {
    label: 'Certified Crop Advisor',
    value: 'certified_crop_advisor',
    id: '6082c53bad98c70001bdea35'
  },
  {
    label: 'Certified Humane Raised and Handled',
    value: 'certified_humane',
    id: '6082c53bad98c70001bdea36'
  },
  {
    label: 'Certified Naturally Grown',
    value: 'naturally_grown',
    id: '6082c53bad98c70001bdea37'
  },
  {
    label: 'Demeter Certified Biodynamic',
    value: 'demeter_biodynamic',
    id: '6082c53bad98c70001bdea38'
  },
  {
    label: 'Ecological Outcomes Verified',
    value: 'ecological_outcomes',
    id: '6082c53bad98c70001bdea39'
  },
  {
    label: 'Equitable Food Initiative',
    value: 'equitable_food_initiative',
    id: '6082c53bad98c70001bdea3a'
  },
  {
    label: 'Fair for Life (fair trade)',
    value: 'fair_for_life',
    id: '6082c53bad98c70001bdea3b'
  },
  {
    label: 'Fair Trade Certified',
    value: 'fair_trade',
    id: '6082c53bad98c70001bdea3c'
  },
  {
    label: 'Fibershed: Climate Beneficial',
    value: 'fibershed_climate_beneficial',
    id: '6082c53bad98c70001bdea3d'
  },
  {
    label: 'Food Alliance Certified',
    value: 'food_alliance',
    id: '6082c53bad98c70001bdea3e'
  },
  {
    label: 'Food Justice Certified (Agricultural Justice Project)',
    value: 'food_justice',
    id: '6082c53bad98c70001bdea3f'
  },
  {
    label: 'FSCAP',
    value: 'fscap',
    id: '6082c53bad98c70001bdea40'
  },
  {
    label: 'Global Animal Partnership',
    value: 'Global Animal Partnership',
    id: '6082c53bad98c70001bdea41'
  },
  {
    label: 'Good Agricultural Practices',
    value: 'gap',
    id: '6082c53bad98c70001bdea42'
  },
  {
    label: 'Homegrown by Heros',
    value: 'homegrown_by_heros',
    id: '6082c53bad98c70001bdea43'
  },
  {
    label: 'Napa Green',
    value: 'napa_green',
    id: '6082c53bad98c70001bdea44'
  },
  {
    label: 'Non-GMO Project Verified',
    value: 'non_gmo',
    id: '6082c53bad98c70001bdea46'
  },
  {
    label: 'Real Organic',
    value: 'real_organic',
    id: '6082c53bad98c70001bdea47'
  },
  {
    label: 'Regenerative Organic Certified',
    value: 'regen_organic',
    id: '6082c53bad98c70001bdea48'
  },
  {
    label: 'Salmon Safe',
    value: 'salmon_safe',
    id: '6082c53bad98c70001bdea49'
  },
  {
    label: 'USDA Organic',
    value: 'usda_organic',
    id: '6082c53bad98c70001bdea4a'
  },
  {
    label: 'Xerces Bee Better Certified',
    value: 'xerces_bee',
    id: '6082c53bad98c70001bdea4b'
  }
]

export const FARM_PRODUCT_LIST = [
  {
    label: 'alfalfa',
    value: 'alfalfa',
    id: '6087e76c53709500013da825'
  },
  {
    label: 'almond',
    value: 'almond',
    id: '6087e76c53709500013da826'
  },
  {
    label: 'amaranth',
    value: 'amaranth',
    id: '6087e76c53709500013da827'
  },
  {
    label: 'angelica stem',
    value: 'angelica_stem',
    id: '6087e76c53709500013da828'
  },
  {
    label: 'anise',
    value: 'anise',
    id: '6087e76c53709500013da829'
  },
  {
    label: 'apple',
    value: 'apple',
    id: '6087e76c53709500013da82a'
  },
  {
    label: 'custard apple',
    value: 'apple_custard',
    id: '6087e76c53709500013da82b'
  },
  {
    label: 'apricot',
    value: 'apricot',
    id: '6087e76c53709500013da82c'
  },
  {
    label: 'arracacha',
    value: 'arracacha',
    id: '6087e76c53709500013da82d'
  },
  {
    label: 'arrowroot',
    value: 'arrowroot',
    id: '6087e76c53709500013da82e'
  },
  {
    label: 'artichoke',
    value: 'artichoke',
    id: '6087e76c53709500013da82f'
  },
  {
    label: 'jerusalem artichoke',
    value: 'artichoke_jerusalem',
    id: '6087e76c53709500013da830'
  },
  {
    label: 'arugula',
    value: 'arugula',
    id: '6087e76c53709500013da831'
  },
  {
    label: 'asparagus',
    value: 'asparagus',
    id: '6087e76c53709500013da832'
  },
  {
    label: 'avocado',
    value: 'avocado',
    id: '6087e76c53709500013da833'
  },
  {
    label: 'bamboo shoot',
    value: 'bamboo_shoot',
    id: '6087e76c53709500013da834'
  },
  {
    label: 'banana',
    value: 'banana',
    id: '6087e76c53709500013da835'
  },
  {
    label: 'barley',
    value: 'barley',
    id: '6087e76c53709500013da836'
  },
  {
    label: 'basil',
    value: 'basil',
    id: '6087e76c53709500013da837'
  },
  {
    label: 'bay leaf',
    value: 'bay_leaf',
    id: '6087e76c53709500013da838'
  },
  {
    label: 'adzuki bean',
    value: 'bean_adzuki',
    id: '6087e76c53709500013da839'
  },
  {
    label: 'anasazi bean',
    value: 'bean_anasazi',
    id: '6087e76c53709500013da83a'
  },
  {
    label: 'black bean',
    value: 'bean_black',
    id: '6087e76c53709500013da83b'
  },
  {
    label: 'broad bean',
    value: 'bean_broad',
    id: '6087e76c53709500013da83c'
  },
  {
    label: 'butter bean',
    value: 'bean_butter',
    id: '6087e76c53709500013da83d'
  },
  {
    label: 'cannellini bean',
    value: 'bean_cannellini',
    id: '6087e76c53709500013da83e'
  },
  {
    label: 'castor bean',
    value: 'bean_castor',
    id: '6087e76c53709500013da83f'
  },
  {
    label: 'common bean',
    value: 'bean_common',
    id: '6087e76c53709500013da840'
  },
  {
    label: 'corona bean',
    value: 'bean_corona',
    id: '6087e76c53709500013da841'
  },
  {
    label: 'dry bean',
    value: 'bean_dry',
    id: '6087e76c53709500013da842'
  },
  {
    label: 'fava bean',
    value: 'bean_fava',
    id: '6087e76c53709500013da843'
  },
  {
    label: 'flageolet bean',
    value: 'bean_flageolot',
    id: '6087e76c53709500013da844'
  },
  {
    label: 'garbanzo bean',
    value: 'bean_garbanzo',
    id: '6087e76c53709500013da845'
  },
  {
    label: 'great northern bean',
    value: 'bean_great_northern',
    id: '6087e76c53709500013da846'
  },
  {
    label: 'green bean',
    value: 'bean_green',
    id: '6087e76c53709500013da847'
  },
  {
    label: 'horse bean',
    value: 'bean_horse',
    id: '6087e76c53709500013da848'
  },
  {
    label: 'kidney bean',
    value: 'bean_kidney',
    id: '6087e76c53709500013da849'
  },
  {
    label: 'lima bean',
    value: 'bean_lima',
    id: '6087e76c53709500013da84a'
  },
  {
    label: 'christmas lima bean',
    value: 'bean_lima_christmas',
    id: '6087e76c53709500013da84b'
  },
  {
    label: 'lupini bean',
    value: 'bean_lupini',
    id: '6087e76c53709500013da84c'
  },
  {
    label: 'marrow bean',
    value: 'bean_marrow',
    id: '6087e76c53709500013da84d'
  },
  {
    label: 'moth bean',
    value: 'bean_moth',
    id: '6087e76c53709500013da84e'
  },
  {
    label: 'mung bean',
    value: 'bean_mung',
    id: '6087e76c53709500013da84f'
  },
  {
    label: 'navy bean',
    value: 'bean_navy',
    id: '6087e76c53709500013da850'
  },
  {
    label: 'pink bean',
    value: 'bean_pink',
    id: '6087e76c53709500013da851'
  },
  {
    label: 'pinto bean',
    value: 'bean_pinto',
    id: '6087e76c53709500013da852'
  },
  {
    label: 'red bean',
    value: 'bean_red',
    id: '6087e76c53709500013da853'
  },
  {
    label: 'rice bean',
    value: 'bean_rice',
    id: '6087e76c53709500013da854'
  },
  {
    label: 'scarlet runner bean',
    value: 'bean_scarlet_runner',
    id: '6087e76c53709500013da855'
  },
  {
    label: 'bean sprout',
    value: 'bean_sprout',
    id: '6087e76c53709500013da856'
  },
  {
    label: 'tepary bean',
    value: 'bean_tepary',
    id: '6087e76c53709500013da857'
  },
  {
    label: 'wax bean',
    value: 'bean_wax',
    id: '6087e76c53709500013da858'
  },
  {
    label: 'beet',
    value: 'beet',
    id: '6087e76c53709500013da859'
  },
  {
    label: 'fodder beet',
    value: 'beet_fodder',
    id: '6087e76c53709500013da85a'
  },
  {
    label: 'beet green',
    value: 'beet_green',
    id: '6087e76c53709500013da85b'
  },
  {
    label: 'red beet',
    value: 'beet_red',
    id: '6087e76c53709500013da85c'
  },
  {
    label: 'sugar beet',
    value: 'beet, sugar',
    id: '6087e76c53709500013da85d'
  },
  {
    label: 'bergamot',
    value: 'bergamot',
    id: '6087e76c53709500013da85e'
  },
  {
    label: 'blackberry',
    value: 'blackberry',
    id: '6087e76c53709500013da85f'
  },
  {
    label: 'blueberry',
    value: 'blueberry',
    id: '6087e76c53709500013da860'
  },
  {
    label: 'annual bluegrass',
    value: 'bluegrass_annual',
    id: '6087e76c53709500013da861'
  },
  {
    label: 'kentucky bluegrass',
    value: 'bluegrass_kentucky',
    id: '6087e76c53709500013da862'
  },
  {
    label: 'sherman bluegrass',
    value: 'bluegrass_sherman',
    id: '6087e76c53709500013da863'
  },
  {
    label: 'bok choy',
    value: 'bok_choy',
    id: '6087e76c53709500013da864'
  },
  {
    label: 'borlotti',
    value: 'borlotti',
    id: '6087e76c53709500013da865'
  },
  {
    label: 'breadfruit',
    value: 'breadfruit',
    id: '6087e76c53709500013da866'
  },
  {
    label: 'broccoli',
    value: 'broccoli',
    id: '6087e76c53709500013da867'
  },
  {
    label: 'chinese broccoli',
    value: 'broccoli_chinese',
    id: '6087e76c53709500013da868'
  },
  {
    label: 'coast broccoli',
    value: 'broccoli_coast',
    id: '6087e76c53709500013da869'
  },
  {
    label: 'desert broccoli',
    value: 'broccoli_desert',
    id: '6087e76c53709500013da86a'
  },
  {
    label: 'buckwheat',
    value: 'buckwheat',
    id: '6087e76c53709500013da86b'
  },
  {
    label: 'cabbage',
    value: 'cabbage',
    id: '6087e76c53709500013da86c'
  },
  {
    label: 'chinese cabbage',
    value: 'cabbage_chinese',
    id: '6087e76c53709500013da86d'
  },
  {
    label: 'fodder cabbage',
    value: 'cabbage_fodder',
    id: '6087e76c53709500013da86e'
  },
  {
    label: 'napa cabbage',
    value: 'cabbage_napa',
    id: '6087e76c53709500013da86f'
  },
  {
    label: 'calabash',
    value: 'calabash',
    id: '6087e76c53709500013da870'
  },
  {
    label: 'cantaloupe',
    value: 'cantaloupe',
    id: '6087e76c53709500013da871'
  },
  {
    label: 'caper',
    value: 'caper',
    id: '6087e76c53709500013da872'
  },
  {
    label: 'cardamom',
    value: 'cardamom',
    id: '6087e76c53709500013da873'
  },
  {
    label: 'cardoon',
    value: 'cardoon',
    id: '6087e76c53709500013da874'
  },
  {
    label: 'carob',
    value: 'carob',
    id: '6087e76c53709500013da875'
  },
  {
    label: 'carrot',
    value: 'carrot',
    id: '6087e76c53709500013da876'
  },
  {
    label: 'carrots',
    value: 'carrots',
    id: '6087e76c53709500013da876'
  },
  {
    label: 'fodder carrot',
    value: 'carrot_fodder',
    id: '6087e76c53709500013da877'
  },
  {
    label: 'cashew',
    value: 'cashew',
    id: '6087e76c53709500013da878'
  },
  {
    label: 'cassava',
    value: 'cassava',
    id: '6087e76c53709500013da879'
  },
  {
    label: 'cauliflower',
    value: 'cauliflower',
    id: '6087e76c53709500013da87a'
  },
  {
    label: 'celeriac',
    value: 'celeriac',
    id: '6087e76c53709500013da87b'
  },
  {
    label: 'celery',
    value: 'celery',
    id: '6087e76c53709500013da87c'
  },
  {
    label: 'celtuce',
    value: 'celtuce',
    id: '6087e76c53709500013da87d'
  },
  {
    label: 'swiss chard',
    value: 'chard_swiss',
    id: '6087e76c53709500013da87e'
  },
  {
    label: 'chayote',
    value: 'chayote',
    id: '6087e76c53709500013da87f'
  },
  {
    label: 'cheatgrass',
    value: 'cheatgrass',
    id: '6087e76c53709500013da880'
  },
  {
    label: 'cherry',
    value: 'cherry',
    id: '6087e76c53709500013da881'
  },
  {
    label: 'sour cherry',
    value: 'cherry_sour',
    id: '6087e76c53709500013da882'
  },
  {
    label: 'chestnut',
    value: 'chestnut',
    id: '6087e76c53709500013da883'
  },
  {
    label: 'water chestnut',
    value: 'chestnut_water',
    id: '6087e76c53709500013da884'
  },
  {
    label: 'chicory',
    value: 'chicory',
    id: '6087e76c53709500013da885'
  },
  {
    label: 'cinnamon',
    value: 'cinnamon',
    id: '6087e76c53709500013da886'
  },
  {
    label: 'citron',
    value: 'citron',
    id: '6087e76c53709500013da887'
  },
  {
    label: 'citronella',
    value: 'citronella',
    id: '6087e76c53709500013da888'
  },
  {
    label: 'clementine',
    value: 'clementine',
    id: '6087e76c53709500013da889'
  },
  {
    label: 'clove',
    value: 'clove',
    id: '6087e76c53709500013da88a'
  },
  {
    label: 'clover',
    value: 'clover',
    id: '6087e76c53709500013da88b'
  },
  {
    label: 'alsike clover',
    value: 'clover_alsike',
    id: '6087e76c53709500013da88c'
  },
  {
    label: 'fodder clover',
    value: 'clover_fodder',
    id: '6087e76c53709500013da88d'
  },
  {
    label: 'red clover',
    value: 'clover_red',
    id: '6087e76c53709500013da88e'
  },
  {
    label: 'seed clover',
    value: 'clover_seed',
    id: '6087e76c53709500013da88f'
  },
  {
    label: 'cocoa',
    value: 'cocoa',
    id: '6087e76c53709500013da890'
  },
  {
    label: 'coconut',
    value: 'coconut',
    id: '6087e76c53709500013da891'
  },
  {
    label: 'coffee',
    value: 'coffee',
    id: '6087e76c53709500013da892'
  },
  {
    label: 'cola nut',
    value: 'cola_nut',
    id: '6087e76c53709500013da893'
  },
  {
    label: 'corn',
    value: 'corn',
    id: '6087e76c53709500013da894'
  },
  {
    label: 'field corn',
    value: 'corn_field',
    id: '6087e76c53709500013da895'
  },
  {
    label: 'grain corn',
    value: 'corn_grain',
    id: '6087e76c53709500013da896'
  },
  {
    label: 'popcorn corn',
    value: 'corn_popcorn',
    id: '6087e76c53709500013da897'
  },
  {
    label: 'silage corn',
    value: 'corn_silage',
    id: '6087e76c53709500013da898'
  },
  {
    label: 'sweet corn',
    value: 'corn_sweet',
    id: '6087e76c53709500013da899'
  },
  {
    label: 'cotton',
    value: 'cotton',
    id: '6087e76c53709500013da89a'
  },
  {
    label: 'cowpea',
    value: 'cowpea',
    id: '6087e76c53709500013da89b'
  },
  {
    label: 'grain cowpea',
    value: 'cowpea_grain',
    id: '6087e76c53709500013da89c'
  },
  {
    label: 'green cowpea',
    value: 'cowpea_green',
    id: '6087e76c53709500013da89d'
  },
  {
    label: 'cranberry',
    value: 'cranberry',
    id: '6087e76c53709500013da89e'
  },
  {
    label: 'cress',
    value: 'cress',
    id: '6087e76c53709500013da89f'
  },
  {
    label: 'cucumber',
    value: 'cucumber',
    id: '6087e76c53709500013da8a0'
  },
  {
    label: 'currant',
    value: 'currant',
    id: '6087e76c53709500013da8a1'
  },
  {
    label: 'dandelion green',
    value: 'dandelion_green',
    id: '6087e76c53709500013da8a2'
  },
  {
    label: 'date',
    value: 'date',
    id: '6087e76c53709500013da8a3'
  },
  {
    label: 'dill',
    value: 'dill',
    id: '6087e76c53709500013da8a4'
  },
  {
    label: 'durian',
    value: 'durian',
    id: '6087e76c53709500013da8a5'
  },
  {
    label: 'eggplant',
    value: 'eggplant',
    id: '6087e76c53709500013da8a6'
  },
  {
    label: 'endive',
    value: 'endive',
    id: '6087e76c53709500013da8a7'
  },
  {
    label: 'belgian endive',
    value: 'endive_belgian',
    id: '6087e76c53709500013da8a8'
  },
  {
    label: 'escarole',
    value: 'escarole',
    id: '6087e76c53709500013da8a9'
  },
  {
    label: 'fennel',
    value: 'fennel',
    id: '6087e76c53709500013da8aa'
  },
  {
    label: 'fenugreek',
    value: 'fenugreek',
    id: '6087e76c53709500013da8ab'
  },
  {
    label: 'idaho fescue',
    value: 'fescue_idaho',
    id: '6087e76c53709500013da8ac'
  },
  {
    label: 'creeping red fescue',
    value: 'fescue_red_creeping',
    id: '6087e76c53709500013da8ad'
  },
  {
    label: 'fiddlehead',
    value: 'fiddlehead',
    id: '6087e76c53709500013da8ae'
  },
  {
    label: 'fig',
    value: 'fig',
    id: '6087e76c53709500013da8af'
  },
  {
    label: 'fique',
    value: 'fique',
    id: '6087e76c53709500013da8b0'
  },
  {
    label: 'flax',
    value: 'flax',
    id: '6087e76c53709500013da8b1'
  },
  {
    label: 'fibre flax',
    value: 'flax_fibre',
    id: '6087e76c53709500013da8b2'
  },
  {
    label: 'oilseed flax',
    value: 'flax_oilseed',
    id: '6087e76c53709500013da8b3'
  },
  {
    label: 'fonio',
    value: 'fonio',
    id: '6087e76c53709500013da8b4'
  },
  {
    label: 'dragon fruit',
    value: 'fruit_dragon',
    id: '6087e76c53709500013da8b5'
  },
  {
    label: 'passion fruit',
    value: 'fruit_passion',
    id: '6087e76c53709500013da8b6'
  },
  {
    label: 'galangal',
    value: 'galangal',
    id: '6087e76c53709500013da8b7'
  },
  {
    label: 'garlic',
    value: 'garlic',
    id: '6087e76c53709500013da8b8'
  },
  {
    label: 'dry garlic',
    value: 'garlic_dry',
    id: '6087e76c53709500013da8b9'
  },
  {
    label: 'green garlic',
    value: 'garlic_green',
    id: '6087e76c53709500013da8ba'
  },
  {
    label: 'geranium',
    value: 'geranium',
    id: '6087e76c53709500013da8bb'
  },
  {
    label: 'ginger',
    value: 'ginger',
    id: '6087e76c53709500013da8bc'
  },
  {
    label: 'ginseng',
    value: 'ginseng',
    id: '6087e76c53709500013da8bd'
  },
  {
    label: 'african gourd',
    value: 'gourd_african',
    id: '6087e76c53709500013da8be'
  },
  {
    label: 'american gourd',
    value: 'gourd_american',
    id: '6087e76c53709500013da8bf'
  },
  {
    label: 'grape',
    value: 'grape',
    id: '6087e76c53709500013da8c0'
  },
  {
    label: 'table grape',
    value: 'grape_table',
    id: '6087e76c53709500013da8c1'
  },
  {
    label: 'wine grape',
    value: 'grape_wine',
    id: '6087e76c53709500013da8c2'
  },
  {
    label: 'grapefruit',
    value: 'grapefruit',
    id: '6087e76c53709500013da8c3'
  },
  {
    label: 'grass',
    value: 'grass',
    id: '6087e76c53709500013da8c4'
  },
  {
    label: 'bahia grass',
    value: 'grass_bahia',
    id: '6087e76c53709500013da8c5'
  },
  {
    label: 'bermuda grass',
    value: 'grass_bermuda',
    id: '6087e76c53709500013da8c6'
  },
  {
    label: 'brome grass',
    value: 'grass_brome',
    id: '6087e76c53709500013da8c7'
  },
  {
    label: 'california brome grass',
    value: 'grass_brome_california',
    id: '6087e76c53709500013da8c8'
  },
  {
    label: 'buffalo grass',
    value: 'grass_buffalo',
    id: '6087e76c53709500013da8c9'
  },
  {
    label: 'clover grass',
    value: 'grass_clover',
    id: '6087e76c53709500013da8ca'
  },
  {
    label: 'esparto grass',
    value: 'grass_esparto',
    id: '6087e76c53709500013da8cb'
  },
  {
    label: 'gama grass',
    value: 'grass_gama',
    id: '6087e76c53709500013da8cc'
  },
  {
    label: 'eastern gama grass',
    value: 'grass_gama_eastern',
    id: '6087e76c53709500013da8cd'
  },
  {
    label: 'indian grass',
    value: 'grass_indian',
    id: '6087e76c53709500013da8ce'
  },
  {
    label: 'johnson grass',
    value: 'grass_johnson',
    id: '6087e76c53709500013da8cf'
  },
  {
    label: 'love grass',
    value: 'grass_love',
    id: '6087e76c53709500013da8d0'
  },
  {
    label: 'orchard grass',
    value: 'grass_orchard',
    id: '6087e76c53709500013da8d1'
  },
  {
    label: 'smooth brome grass',
    value: 'grass_smooth_brome',
    id: '6087e76c53709500013da8d2'
  },
  {
    label: 'sudan grass',
    value: 'grass_sudan',
    id: '6087e76c53709500013da8d3'
  },
  {
    label: 'timothy grass',
    value: 'grass_timothy',
    id: '6087e76c53709500013da8d4'
  },
  {
    label: 'collard green',
    value: 'green_collard',
    id: '6087e76c53709500013da8d5'
  },
  {
    label: 'guarana',
    value: 'guarana',
    id: '6087e76c53709500013da8d6'
  },
  {
    label: 'guava',
    value: 'guava',
    id: '6087e76c53709500013da8d7'
  },
  {
    label: 'hazelnut',
    value: 'hazelnut',
    id: '6087e76c53709500013da8d8'
  },
  {
    label: 'hemp',
    value: 'hemp',
    id: '6087e76c53709500013da8d9'
  },
  {
    label: 'manila hemp',
    value: 'hemp_manila',
    id: '6087e76c53709500013da8da'
  },
  {
    label: 'sun hemp',
    value: 'hemp_sun',
    id: '6087e76c53709500013da8db'
  },
  {
    label: 'henequen',
    value: 'henequen',
    id: '6087e76c53709500013da8dc'
  },
  {
    label: 'henna',
    value: 'henna',
    id: '6087e76c53709500013da8dd'
  },
  {
    label: 'hops',
    value: 'hops',
    id: '6087e76c53709500013da8de'
  },
  {
    label: 'horseradish',
    value: 'horseradish',
    id: '6087e76c53709500013da8df'
  },
  {
    label: 'indigo',
    value: 'indigo',
    id: '6087e76c53709500013da8e0'
  },
  {
    label: 'jackfruit',
    value: 'jackfruit',
    id: '6087e76c53709500013da8e1'
  },
  {
    label: 'jasmine',
    value: 'jasmine',
    id: '6087e76c53709500013da8e2'
  },
  {
    label: 'jicama',
    value: 'jicama',
    id: '6087e76c53709500013da8e3'
  },
  {
    label: 'jojoba',
    value: 'jojoba',
    id: '6087e76c53709500013da8e4'
  },
  {
    label: 'jujube',
    value: 'jujube',
    id: '6087e76c53709500013da8e5'
  },
  {
    label: 'jute',
    value: 'jute',
    id: '6087e76c53709500013da8e6'
  },
  {
    label: 'kale',
    value: 'kale',
    id: '6087e76c53709500013da8e7'
  },
  {
    label: 'kapok',
    value: 'kapok',
    id: '6087e76c53709500013da8e8'
  },
  {
    label: 'kava',
    value: 'kava',
    id: '6087e76c53709500013da8e9'
  },
  {
    label: 'kenaf',
    value: 'kenaf',
    id: '6087e76c53709500013da8ea'
  },
  {
    label: 'kiwi',
    value: 'kiwi',
    id: '6087e76c53709500013da8eb'
  },
  {
    label: 'kohlrabi',
    value: 'kohlrabi',
    id: '6087e76c53709500013da8ec'
  },
  {
    label: 'kohlrabi green',
    value: 'kohlrabi_green',
    id: '6087e76c53709500013da8ed'
  },
  {
    label: 'kumquat',
    value: 'kumquat',
    id: '6087e76c53709500013da8ee'
  },
  {
    label: 'lacinato',
    value: 'lacinato',
    id: '6087e76c53709500013da8ef'
  },
  {
    label: 'lavender',
    value: 'lavender',
    id: '6087e76c53709500013da8f0'
  },
  {
    label: 'leek',
    value: 'leek',
    id: '6087e76c53709500013da8f1'
  },
  {
    label: 'lemon',
    value: 'lemon',
    id: '6087e76c53709500013da8f2'
  },
  {
    label: 'lemongrass',
    value: 'lemongrass',
    id: '6087e76c53709500013da8f3'
  },
  {
    label: 'lentil',
    value: 'lentil',
    id: '6087e76c53709500013da8f4'
  },
  {
    label: 'lespedeza',
    value: 'lespedeza',
    id: '6087e76c53709500013da8f5'
  },
  {
    label: 'lettuce',
    value: 'lettuce',
    id: '6087e76c53709500013da8f6'
  },
  {
    label: 'head lettuce',
    value: 'lettuce_head',
    id: '6087e76c53709500013da8f7'
  },
  {
    label: 'leaf lettuce',
    value: 'lettuce_leaf',
    id: '6087e76c53709500013da8f8'
  },
  {
    label: 'romaine lettuce',
    value: 'lettuce_romaine',
    id: '6087e76c53709500013da8f9'
  },
  {
    label: 'lime',
    value: 'lime',
    id: '6087e76c53709500013da8fa'
  },
  {
    label: 'sour lime',
    value: 'lime_sour',
    id: '6087e76c53709500013da8fb'
  },
  {
    label: 'sweet lime',
    value: 'lime_sweet',
    id: '6087e76c53709500013da8fc'
  },
  {
    label: 'liquorice',
    value: 'liquorice',
    id: '6087e76c53709500013da8fd'
  },
  {
    label: 'longan',
    value: 'longan',
    id: '6087e76c53709500013da8fe'
  },
  {
    label: 'loquat',
    value: 'loquat',
    id: '6087e76c53709500013da8ff'
  },
  {
    label: 'lotus root',
    value: 'lotus_root',
    id: '6087e76c53709500013da900'
  },
  {
    label: 'lotus seed',
    value: 'lotus_seed',
    id: '6087e76c53709500013da901'
  },
  {
    label: 'lucuma',
    value: 'lucuma',
    id: '6087e76c53709500013da902'
  },
  {
    label: 'lupine',
    value: 'lupine',
    id: '6087e76c53709500013da903'
  },
  {
    label: 'lychee',
    value: 'lychee',
    id: '6087e76c53709500013da904'
  },
  {
    label: 'maguey',
    value: 'maguey',
    id: '6087e76c53709500013da905'
  },
  {
    label: 'mamey sapote',
    value: 'mamey_sapote',
    id: '6087e76c53709500013da906'
  },
  {
    label: 'mandarin',
    value: 'mandarin',
    id: '6087e76c53709500013da907'
  },
  {
    label: 'mango',
    value: 'mango',
    id: '6087e76c53709500013da908'
  },
  {
    label: 'mangosteen',
    value: 'mangosteen',
    id: '6087e76c53709500013da909'
  },
  {
    label: 'yerba mate',
    value: 'mate_yerba',
    id: '6087e76c53709500013da90a'
  },
  {
    label: 'medlar',
    value: 'medlar',
    id: '6087e76c53709500013da90b'
  },
  {
    label: 'melon',
    value: 'melon',
    id: '6087e76c53709500013da90c'
  },
  {
    label: 'bitter melon',
    value: 'melon_bitter',
    id: '6087e76c53709500013da90d'
  },
  {
    label: 'winter melon',
    value: 'melon_winter',
    id: '6087e76c53709500013da90e'
  },
  {
    label: 'millet',
    value: 'millet',
    id: '6087e76c53709500013da90f'
  },
  {
    label: 'broom millet',
    value: 'millet_broom',
    id: '6087e76c53709500013da910'
  },
  {
    label: 'finger millet',
    value: 'millet_finger',
    id: '6087e76c53709500013da911'
  },
  {
    label: 'foxtail millet',
    value: 'millet_foxtail',
    id: '6087e76c53709500013da912'
  },
  {
    label: 'japanese millet',
    value: 'millet_japanese',
    id: '6087e76c53709500013da913'
  },
  {
    label: 'pearl millet',
    value: 'millet_pearl',
    id: '6087e76c53709500013da914'
  },
  {
    label: 'proso millet',
    value: 'millet_proso',
    id: '6087e76c53709500013da915'
  },
  {
    label: 'mint',
    value: 'mint',
    id: '6087e76c53709500013da916'
  },
  {
    label: 'mizuna',
    value: 'mizuna',
    id: '6087e76c53709500013da917'
  },
  {
    label: 'mulberry',
    value: 'mulberry',
    id: '6087e76c53709500013da918'
  },
  {
    label: 'mustard',
    value: 'mustard',
    id: '6087e76c53709500013da919'
  },
  {
    label: 'mustard green',
    value: 'mustard_green',
    id: '6087e76c53709500013da91a'
  },
  {
    label: 'nance',
    value: 'nance',
    id: '6087e76c53709500013da91b'
  },
  {
    label: 'nectarine',
    value: 'nectarine',
    id: '6087e76c53709500013da91c'
  },
  {
    label: 'noni',
    value: 'noni',
    id: '6087e76c53709500013da91d'
  },
  {
    label: 'nopal',
    value: 'nopal',
    id: '6087e76c53709500013da91e'
  },
  {
    label: 'betel nut',
    value: 'nut_betel',
    id: '6087e76c53709500013da91f'
  },
  {
    label: 'brazil nut',
    value: 'nut_brazil',
    id: '6087e76c53709500013da920'
  },
  {
    label: 'kola nut',
    value: 'nut_kola',
    id: '6087e76c53709500013da921'
  },
  {
    label: 'macadamia nut',
    value: 'nut_macadamia',
    id: '6087e76c53709500013da922'
  },
  {
    label: 'nutmeg',
    value: 'nutmeg',
    id: '6087e76c53709500013da923'
  },
  {
    label: 'oat',
    value: 'oat',
    id: '6087e76c53709500013da924'
  },
  {
    label: 'fodder oat',
    value: 'oat_fodder',
    id: '6087e76c53709500013da925'
  },
  {
    label: 'grain oat',
    value: 'oat_grain',
    id: '6087e76c53709500013da926'
  },
  {
    label: 'okra',
    value: 'okra',
    id: '6087e76c53709500013da927'
  },
  {
    label: 'olive',
    value: 'olive',
    id: '6087e76c53709500013da928'
  },
  {
    label: 'onion',
    value: 'onion',
    id: '6087e76c53709500013da929'
  },
  {
    label: 'dry onion',
    value: 'onion_dry',
    id: '6087e76c53709500013da92a'
  },
  {
    label: 'green onion',
    value: 'onion_green',
    id: '6087e76c53709500013da92b'
  },
  {
    label: 'seed onion',
    value: 'onion_seed',
    id: '6087e76c53709500013da92c'
  },
  {
    label: 'orange',
    value: 'orange',
    id: '6087e76c53709500013da92d'
  },
  {
    label: 'bitter orange',
    value: 'orange_bitter',
    id: '6087e76c53709500013da92e'
  },
  {
    label: 'blood orange',
    value: 'orange_blood',
    id: '6087e76c53709500013da92f'
  },
  {
    label: 'kernel palm',
    value: 'palm_kernel',
    id: '6087e76c53709500013da930'
  },
  {
    label: 'palm oil',
    value: 'palm_oil',
    id: '6087e76c53709500013da931'
  },
  {
    label: 'palmyra palm',
    value: 'palm_palmyra',
    id: '6087e76c53709500013da932'
  },
  {
    label: 'sago palm',
    value: 'palm_sago',
    id: '6087e76c53709500013da933'
  },
  {
    label: 'papaya',
    value: 'papaya',
    id: '6087e76c53709500013da934'
  },
  {
    label: 'parsley',
    value: 'parsley',
    id: '6087e76c53709500013da935'
  },
  {
    label: 'parsley root',
    value: 'parsley_root',
    id: '6087e76c53709500013da936'
  },
  {
    label: 'parsnip',
    value: 'parsnip',
    id: '6087e76c53709500013da937'
  },
  {
    label: 'pea',
    value: 'pea',
    id: '6087e76c53709500013da938'
  },
  {
    label: 'black-eyed pea',
    value: 'pea_black-eyed',
    id: '6087e76c53709500013da939'
  },
  {
    label: 'dry pea',
    value: 'pea_dry',
    id: '6087e76c53709500013da93a'
  },
  {
    label: 'earthpea',
    value: 'pea_earth',
    id: '6087e76c53709500013da93b'
  },
  {
    label: 'green pea',
    value: 'pea_green',
    id: '6087e76c53709500013da93c'
  },
  {
    label: 'pigeon pea',
    value: 'pea_pigeon',
    id: '6087e76c53709500013da93d'
  },
  {
    label: 'snow pea',
    value: 'pea_snow',
    id: '6087e76c53709500013da93e'
  },
  {
    label: 'split pea',
    value: 'pea_split',
    id: '6087e76c53709500013da93f'
  },
  {
    label: 'sugar snap pea',
    value: 'pea_sugar_snap',
    id: '6087e76c53709500013da940'
  },
  {
    label: 'peach',
    value: 'peach',
    id: '6087e76c53709500013da941'
  },
  {
    label: 'peanut',
    value: 'peanut',
    id: '6087e76c53709500013da942'
  },
  {
    label: 'pear',
    value: 'pear',
    id: '6087e76c53709500013da943'
  },
  {
    label: 'asian pear',
    value: 'pear_asian',
    id: '6087e76c53709500013da944'
  },
  {
    label: 'prickly pear',
    value: 'pear_prickly',
    id: '6087e76c53709500013da945'
  },
  {
    label: 'pecan',
    value: 'pecan',
    id: '6087e76c53709500013da946'
  },
  {
    label: 'pepper',
    value: 'pepper',
    id: '6087e76c53709500013da947'
  },
  {
    label: 'bell pepper',
    value: 'pepper_bell',
    id: '6087e76c53709500013da948'
  },
  {
    label: 'black pepper',
    value: 'pepper_black',
    id: '6087e76c53709500013da949'
  },
  {
    label: 'guinea pepper',
    value: 'pepper_guinea',
    id: '6087e76c53709500013da94a'
  },
  {
    label: 'sweet pepper',
    value: 'pepper_sweet',
    id: '6087e76c53709500013da94b'
  },
  {
    label: 'persimmon',
    value: 'persimmon',
    id: '6087e76c53709500013da94c'
  },
  {
    label: 'kaki persimmon',
    value: 'persimmon_kaki',
    id: '6087e76c53709500013da94d'
  },
  {
    label: 'pineapple',
    value: 'pineapple',
    id: '6087e76c53709500013da94e'
  },
  {
    label: 'pistachio',
    value: 'pistachio',
    id: '6087e76c53709500013da94f'
  },
  {
    label: 'plantain',
    value: 'plantain',
    id: '6087e76c53709500013da950'
  },
  {
    label: 'plum',
    value: 'plum',
    id: '6087e76c53709500013da951'
  },
  {
    label: 'pomegranate',
    value: 'pomegranate',
    id: '6087e76c53709500013da952'
  },
  {
    label: 'pomelo',
    value: 'pomelo',
    id: '6087e76c53709500013da953'
  },
  {
    label: 'poppy',
    value: 'poppy',
    id: '6087e76c53709500013da954'
  },
  {
    label: 'potato',
    value: 'potato',
    id: '6087e76c53709500013da955'
  },
  {
    label: 'sweet potato',
    value: 'potato_sweet',
    id: '6087e76c53709500013da956'
  },
  {
    label: 'prune',
    value: 'prune',
    id: '6087e76c53709500013da957'
  },
  {
    label: 'pumpkin',
    value: 'pumpkin',
    id: '6087e76c53709500013da958'
  },
  {
    label: 'edible pumpkin',
    value: 'pumpkin_edible',
    id: '6087e76c53709500013da959'
  },
  {
    label: 'fodder pumpkin',
    value: 'pumpkin_fodder',
    id: '6087e76c53709500013da95a'
  },
  {
    label: 'purslane',
    value: 'purslane',
    id: '6087e76c53709500013da95b'
  },
  {
    label: 'pyrethrum',
    value: 'pyrethrum',
    id: '6087e76c53709500013da95c'
  },
  {
    label: 'quebracho',
    value: 'quebracho',
    id: '6087e76c53709500013da95d'
  },
  {
    label: 'quince',
    value: 'quince',
    id: '6087e76c53709500013da95e'
  },
  {
    label: 'quinine',
    value: 'quinine',
    id: '6087e76c53709500013da95f'
  },
  {
    label: 'quinoa',
    value: 'quinoa',
    id: '6087e76c53709500013da960'
  },
  {
    label: 'radicchio',
    value: 'radicchio',
    id: '6087e76c53709500013da961'
  },
  {
    label: 'radish',
    value: 'radish',
    id: '6087e76c53709500013da962'
  },
  {
    label: 'daikon radish',
    value: 'radish_daikon',
    id: '6087e76c53709500013da963'
  },
  {
    label: 'forage radish',
    value: 'radish_forage',
    id: '6087e76c53709500013da964'
  },
  {
    label: 'oilseed radish',
    value: 'radish_oilseed',
    id: '6087e76c53709500013da965'
  },
  {
    label: 'raisin',
    value: 'raisin',
    id: '6087e76c53709500013da966'
  },
  {
    label: 'rambutan',
    value: 'rambutan',
    id: '6087e76c53709500013da967'
  },
  {
    label: 'ramie',
    value: 'ramie',
    id: '6087e76c53709500013da968'
  },
  {
    label: 'rapeseed',
    value: 'rapeseed',
    id: '6087e76c53709500013da969'
  },
  {
    label: 'raspberry',
    value: 'raspberry',
    id: '6087e76c53709500013da96a'
  },
  {
    label: 'redtop',
    value: 'redtop',
    id: '6087e76c53709500013da96b'
  },
  {
    label: 'rhubarb',
    value: 'rhubarb',
    id: '6087e76c53709500013da96c'
  },
  {
    label: 'rice',
    value: 'rice',
    id: '6087e76c53709500013da96d'
  },
  {
    label: 'african rice',
    value: 'rice_african',
    id: '6087e76c53709500013da96e'
  },
  {
    label: 'brown rice',
    value: 'rice_brown',
    id: '6087e76c53709500013da96f'
  },
  {
    label: 'white rice',
    value: 'rice_white',
    id: '6087e76c53709500013da970'
  },
  {
    label: 'wild rice',
    value: 'rice_wild',
    id: '6087e76c53709500013da971'
  },
  {
    label: 'burdock root',
    value: 'root_burdock',
    id: '6087e76c53709500013da972'
  },
  {
    label: 'rose',
    value: 'rose',
    id: '6087e76c53709500013da973'
  },
  {
    label: 'rubber',
    value: 'rubber',
    id: '6087e76c53709500013da974'
  },
  {
    label: 'rye',
    value: 'rye',
    id: '6087e76c53709500013da975'
  },
  {
    label: 'altai wild rye',
    value: 'rye_altai_wild',
    id: '6087e76c53709500013da976'
  },
  {
    label: 'cereal rye',
    value: 'rye_cereal',
    id: '6087e76c53709500013da977'
  },
  {
    label: 'russion wild rye',
    value: 'rye_russian_wild',
    id: '6087e76c53709500013da978'
  },
  {
    label: 'blue wild rye',
    value: 'rye_wild_blue',
    id: '6087e76c53709500013da979'
  },
  {
    label: 'ryegrass',
    value: 'ryegrass',
    id: '6087e76c53709500013da97a'
  },
  {
    label: 'annual ryegrass',
    value: 'ryegrass_annual',
    id: '6087e76c53709500013da97b'
  },
  {
    label: 'safflower',
    value: 'safflower',
    id: '6087e76c53709500013da97c'
  },
  {
    label: 'saffron',
    value: 'saffron',
    id: '6087e76c53709500013da97d'
  },
  {
    label: 'sainfoin',
    value: 'sainfoin',
    id: '6087e76c53709500013da97e'
  },
  {
    label: 'salsify',
    value: 'salsify',
    id: '6087e76c53709500013da97f'
  },
  {
    label: 'sapodilla',
    value: 'sapodilla',
    id: '6087e76c53709500013da980'
  },
  {
    label: 'satsuma',
    value: 'satsuma',
    id: '6087e76c53709500013da981'
  },
  {
    label: 'savoy',
    value: 'savoy',
    id: '6087e76c53709500013da982'
  },
  {
    label: 'scorzonera',
    value: 'scorzonera',
    id: '6087e76c53709500013da983'
  },
  {
    label: 'caraway seed',
    value: 'seed_caraway',
    id: '6087e76c53709500013da984'
  },
  {
    label: 'niger seed',
    value: 'seed_niger',
    id: '6087e76c53709500013da985'
  },
  {
    label: 'sesame',
    value: 'sesame',
    id: '6087e76c53709500013da986'
  },
  {
    label: 'shallot',
    value: 'shallot',
    id: '6087e76c53709500013da987'
  },
  {
    label: 'shea tree',
    value: 'shea_tree',
    id: '6087e76c53709500013da988'
  },
  {
    label: 'sisal',
    value: 'sisal',
    id: '6087e76c53709500013da989'
  },
  {
    label: 'sorghum',
    value: 'sorghum',
    id: '6087e76c53709500013da98a'
  },
  {
    label: 'broom sorghum',
    value: 'sorghum_broom',
    id: '6087e76c53709500013da98b'
  },
  {
    label: 'sweet sorghum',
    value: 'sorghum_sweet',
    id: '6087e76c53709500013da98c'
  },
  {
    label: 'soybean',
    value: 'soybean',
    id: '6087e76c53709500013da98d'
  },
  {
    label: 'spelt',
    value: 'spelt',
    id: '6087e76c53709500013da98e'
  },
  {
    label: 'spinach',
    value: 'spinach',
    id: '6087e76c53709500013da98f'
  },
  {
    label: 'water spinach',
    value: 'spinach_water',
    id: '6087e76c53709500013da990'
  },
  {
    label: 'brussel sprout',
    value: 'sprout_brussel',
    id: '6087e76c53709500013da991'
  },
  {
    label: 'squash',
    value: 'squash',
    id: '6087e76c53709500013da992'
  },
  {
    label: 'starfruit',
    value: 'starfruit',
    id: '6087e76c53709500013da993'
  },
  {
    label: 'strawberry',
    value: 'strawberry',
    id: '6087e76c53709500013da994'
  },
  {
    label: 'sugarcane',
    value: 'sugarcane',
    id: '6087e76c53709500013da995'
  },
  {
    label: 'sunflower',
    value: 'sunflower',
    id: '6087e76c53709500013da996'
  },
  {
    label: 'oilseed sunflower',
    value: 'sunflower_oilseed',
    id: '6087e76c53709500013da997'
  },
  {
    label: 'sunhemp',
    value: 'sunhemp',
    id: '6087e76c53709500013da998'
  },
  {
    label: 'switchgrass',
    value: 'switchgrass',
    id: '6087e76c53709500013da999'
  },
  {
    label: 'tamarilla',
    value: 'tamarilla',
    id: '6087e76c53709500013da99a'
  },
  {
    label: 'tamarind',
    value: 'tamarind',
    id: '6087e76c53709500013da99b'
  },
  {
    label: 'tangelo',
    value: 'tangelo',
    id: '6087e76c53709500013da99c'
  },
  {
    label: 'tangerine',
    value: 'tangerine',
    id: '6087e76c53709500013da99d'
  },
  {
    label: 'tannia',
    value: 'tannia',
    id: '6087e76c53709500013da99e'
  },
  {
    label: 'tapioca',
    value: 'tapioca',
    id: '6087e76c53709500013da99f'
  },
  {
    label: 'taro',
    value: 'taro',
    id: '6087e76c53709500013da9a0'
  },
  {
    label: 'tea',
    value: 'tea',
    id: '6087e76c53709500013da9a1'
  },
  {
    label: 'teff',
    value: 'teff',
    id: '6087e76c53709500013da9a2'
  },
  {
    label: 'thymus',
    value: 'thymus',
    id: '6087e76c53709500013da9a3'
  },
  {
    label: 'tobacco',
    value: 'tobacco',
    id: '6087e76c53709500013da9a4'
  },
  {
    label: 'tomatillo',
    value: 'tomatillo',
    id: '6087e76c53709500013da9a5'
  },
  {
    label: 'tomato',
    value: 'tomato',
    id: '6087e76c53709500013da9a6'
  },
  {
    label: 'fresh tomato',
    value: 'tomato_fresh',
    id: '6087e76c53709500013da9a7'
  },
  {
    label: 'processing tomato',
    value: 'tomato_processing',
    id: '6087e76c53709500013da9a8'
  },
  {
    label: 'drumstick tree',
    value: 'tree_drumstick',
    id: '6087e76c53709500013da9a9'
  },
  {
    label: 'tallow tree',
    value: 'tree_tallow',
    id: '6087e76c53709500013da9aa'
  },
  {
    label: 'tung tree',
    value: 'tree_tung',
    id: '6087e76c53709500013da9ab'
  },
  {
    label: 'trefoil',
    value: 'trefoil',
    id: '6087e76c53709500013da9ac'
  },
  {
    label: 'triticale',
    value: 'triticale',
    id: '6087e76c53709500013da9ad'
  },
  {
    label: 'turmeric',
    value: 'turmeric',
    id: '6087e76c53709500013da9ae'
  },
  {
    label: 'turnip',
    value: 'turnip',
    id: '6087e76c53709500013da9af'
  },
  {
    label: 'urad',
    value: 'urad',
    id: '6087e76c53709500013da9b0'
  },
  {
    label: 'urena',
    value: 'urena',
    id: '6087e76c53709500013da9b1'
  },
  {
    label: 'vanilla',
    value: 'vanilla',
    id: '6087e76c53709500013da9b2'
  },
  {
    label: 'vetch',
    value: 'vetch',
    id: '6087e76c53709500013da9b3'
  },
  {
    label: 'walnut',
    value: 'walnut',
    id: '6087e76c53709500013da9b4'
  },
  {
    label: 'english walnut',
    value: 'walnut_english',
    id: '6087e76c53709500013da9b5'
  },
  {
    label: 'watercress',
    value: 'watercress',
    id: '6087e76c53709500013da9b6'
  },
  {
    label: 'watermelon',
    value: 'watermelon',
    id: '6087e76c53709500013da9b7'
  },
  {
    label: 'black wattle',
    value: 'wattle_black',
    id: '6087e76c53709500013da9b8'
  },
  {
    label: 'wheat',
    value: 'wheat',
    id: '6087e76c53709500013da9b9'
  },
  {
    label: 'durum wheat',
    value: 'wheat_durum',
    id: '6087e76c53709500013da9ba'
  },
  {
    label: 'spring wheat',
    value: 'wheat_spring',
    id: '6087e76c53709500013da9bb'
  },
  {
    label: 'winter wheat',
    value: 'wheat_winter',
    id: '6087e76c53709500013da9bc'
  },
  {
    label: 'yam',
    value: 'yam',
    id: '6087e76c53709500013da9bd'
  },
  {
    label: 'zucchini',
    value: 'zucchini',
    id: '6087e76c53709500013da9be'
  }
]
