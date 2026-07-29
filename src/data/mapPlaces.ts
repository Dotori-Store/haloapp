import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import prayerIcon from '../assets/icons/ico-cat-prayer.svg'
import photoFood from '../assets/dummy/photo-food.jpg'

type Category = 'all' | 'food' | 'cafe' | 'prayer'

export type MapPlace = {
  id: string
  name: string
  category: Exclude<Category, 'all'>
  x: number
  y: number
  icon: string
  detailPlaceId: 'nearby-1' | 'nearby-2' | 'nearby-3'
}

export type ListMapPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
  detailType: 1 | 2 | 3
  category: Exclude<Category, 'all'>
  x: number
  y: number
}

export type NearbyPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
  detailType: 1 | 2 | 3
  photoUrl?: string
}

export const mapPlaces: MapPlace[] = [
  { id: 'food-1', name: '불고기마당', category: 'food', x: 22, y: 51, icon: foodIcon, detailPlaceId: 'nearby-1' },
  { id: 'food-2', name: '면맛집', category: 'food', x: 71, y: 58, icon: foodIcon, detailPlaceId: 'nearby-2' },
  { id: 'cafe-1', name: '모닝빈', category: 'cafe', x: 61, y: 40, icon: cafeIcon, detailPlaceId: 'nearby-3' },
  { id: 'cafe-2', name: '퀴엇브루', category: 'cafe', x: 35, y: 68, icon: cafeIcon, detailPlaceId: 'nearby-1' },
  { id: 'prayer-1', name: '평화공간', category: 'prayer', x: 80, y: 34, icon: prayerIcon, detailPlaceId: 'nearby-2' },
]

export const listMapPlaces: ListMapPlace[] = [
  {
    id: 'list-map-1',
    name: '다정한한식당',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 1,
    category: 'food',
    x: 22,
    y: 53,
  },
  {
    id: 'list-map-2',
    name: '안동갈비한식당',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
    category: 'food',
    x: 62,
    y: 42,
  },
  {
    id: 'list-map-3',
    name: '오지커피',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 3,
    category: 'cafe',
    x: 70,
    y: 58,
  },
  {
    id: 'list-map-4',
    name: '써니무드카페',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
    category: 'cafe',
    x: 40,
    y: 66,
  },
]

export const nearbyPlacesData: NearbyPlace[] = [
  {
    id: 'nearby-1',
    name: '하늘한식당',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 1,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-2',
    name: '안동갈비집',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-3',
    name: '다정한한식당',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 3,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-4',
    name: '한사랑푸드',
    status: 'Closed',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-5',
    name: '한사랑푸드',
    status: 'Closed',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-6',
    name: '한사랑푸드',
    status: 'Closed',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-7',
    name: '한사랑푸드',
    status: 'Closed',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
]

export const searchResultPlacesData: NearbyPlace[] = [
  {
    id: 'search-1',
    name: '다정한한식당',
    status: 'Open',
    address: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'search-2',
    name: '서부할랄키친',
    status: 'Open',
    address: '서부로 2129-1, 장안구',
    detailType: 2,
  },
  {
    id: 'search-3',
    name: '캠퍼스푸드코트',
    status: 'Closed',
    address: '수원시 영통구',
    detailType: 2,
  },
  {
    id: 'search-4',
    name: '수원라이스볼',
    status: 'Open',
    address: '화성로 33, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-5',
    name: '모닝누들바',
    status: 'Open',
    address: '서둔동 18, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-6',
    name: '한강간식집',
    status: 'Closed',
    address: '인계로 91, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-7',
    name: '골든스푼카페',
    status: 'Open',
    address: '매탄로 12, 영통구',
    detailType: 2,
  },
  {
    id: 'search-8',
    name: '서부코너식당',
    status: 'Closed',
    address: '서부로 44, 장안구',
    detailType: 2,
  },
  {
    id: 'search-9',
    name: '캠퍼스분식',
    status: 'Open',
    address: '과천대로 205, 장안구',
    detailType: 2,
  },
  {
    id: 'search-10',
    name: '오픈테이블키친',
    status: 'Open',
    address: '강남로 78, 수원시',
    detailType: 2,
  },
  {
    id: 'search-11',
    name: '라이스앤보울마켓',
    status: 'Closed',
    address: '월화로 9, 수원시',
    detailType: 2,
  },
  {
    id: 'search-12',
    name: '리틀서울이터리',
    status: 'Open',
    address: '화성시 61, 경기도',
    detailType: 2,
  },
]
