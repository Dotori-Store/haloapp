export type NearbyPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
}

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'nearby-1',
    name: 'Haneul Korean Restaurant',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-2',
    name: 'Andong Galbi House',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-3',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-4',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-5',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-6',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'nearby-7',
    name: 'Jangan Local Kitchen',
    status: 'Open',
    address: '109, Seobu-ro, Jangan...'
  },
]
export const searchResultPlaces: NearbyPlace[] = [
  {
    id: 'search-1',
    name: 'Dajunghan Korean Restaurant',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'search-2',
    name: 'Seobu Halal Kitchen',
    status: 'Open',
    address: '2129-1, Seobu-ro, Jangan-gu'
  },
  {
    id: 'search-3',
    name: 'Campus Food Court',
    status: 'Closed',
    address: 'Yeongtong-gu, Suwon-si'
  },
]
