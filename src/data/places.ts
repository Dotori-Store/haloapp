import photoFood from '../assets/dummy/photo-food.jpg'

export type NearbyPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
  detailType: 1 | 2 | 3
  photoUrl?: string
}

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'nearby-1',
    name: 'Haneul Korean Restaurant',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 1,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-2',
    name: 'Andong Galbi House',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'nearby-3',
    name: 'Dajunghan Korean Restaurant',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 3,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-4',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'nearby-5',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'nearby-6',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'nearby-7',
    name: 'Hansarang Food',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
]

export const searchResultPlaces: NearbyPlace[] = [
  {
    id: 'search-1',
    name: 'Dajunghan Korean Restaurant',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'search-2',
    name: 'Seobu Halal Kitchen',
    status: 'Open',
    address: '2129-1, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'search-3',
    name: 'Campus Food Court',
    status: 'Closed',
    address: 'Yeongtong-gu, Suwon-si',
    detailType: 2,
  },
  {
    id: 'search-4',
    name: 'Suwon Rice Bowl',
    status: 'Open',
    address: '33, Hwaseong-ro, Paldal-gu',
    detailType: 2,
  },
  {
    id: 'search-5',
    name: 'Morning Noodle Bar',
    status: 'Open',
    address: '18, Seodun-dong, Paldal-gu',
    detailType: 2,
  },
  {
    id: 'search-6',
    name: 'Han River Snack House',
    status: 'Closed',
    address: '91, Ingye-ro, Paldal-gu',
    detailType: 2,
  },
  {
    id: 'search-7',
    name: 'Golden Spoon Cafe',
    status: 'Open',
    address: '12, Maetan-ro, Yeongtong-gu',
    detailType: 2,
  },
  {
    id: 'search-8',
    name: 'Seobu Corner Diner',
    status: 'Closed',
    address: '44, Seobu-ro, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'search-9',
    name: 'Campus Bunsik',
    status: 'Open',
    address: '205, Gwacheon-daero, Jangan-gu',
    detailType: 2,
  },
  {
    id: 'search-10',
    name: 'Open Table Kitchen',
    status: 'Open',
    address: '78, Gangnam-ro, Suwon-si',
    detailType: 2,
  },
  {
    id: 'search-11',
    name: 'Rice & Bowl Market',
    status: 'Closed',
    address: '9, Wolhwa-ro, Suwon-si',
    detailType: 2,
  },
  {
    id: 'search-12',
    name: 'Little Seoul Eatery',
    status: 'Open',
    address: '61, Hwaseong-si, Gyeonggi-do',
    detailType: 2,
  },
]
