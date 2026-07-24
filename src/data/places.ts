export type NearbyPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
}

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'nearby-1',
    name: 'Dajunghan korean  restau...',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-2',
    name: 'Andong galbi korean resta...',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-3',
    name: 'Hnsarang food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-4',
    name: 'Hnsarang food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-5',
    name: 'Hnsarang food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-6',
    name: 'Hnsarang food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan...',
  },
  {
    id: 'nearby-7',
    name: 'Jangan local kitchen',
    status: 'Open',
    address: '109, Seobu-ro, Jangan...',
  },
]
