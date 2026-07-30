import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import prayerIcon from '../assets/icons/ico-cat-prayer.svg'
import photoFood from '../assets/dummy/photo-food.jpg'

type Category = 'all' | 'food' | 'cafe' | 'prayer'

type LocalizedPlaceFields = {
  nameKo?: string
  addressKo?: string
}

export type MapPlace = {
  id: string
  name: string
  category: Exclude<Category, 'all'>
  x: number
  y: number
  icon: string
  detailPlaceId: 'nearby-1' | 'nearby-2' | 'nearby-3'
} & LocalizedPlaceFields

export type ListMapPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
  detailType: 1 | 2 | 3
  category: Exclude<Category, 'all'>
  x: number
  y: number
} & LocalizedPlaceFields

export type NearbyPlace = {
  id: string
  name: string
  status: 'Open' | 'Closed'
  address: string
  detailType: 1 | 2 | 3
  photoUrl?: string
} & LocalizedPlaceFields

export const getLocalizedPlaceName = (language: string, place: Pick<MapPlace | ListMapPlace | NearbyPlace, 'name' | 'nameKo'>) => {
  return language.startsWith('ko') && place.nameKo ? place.nameKo : place.name
}

export const getLocalizedPlaceAddress = (
  language: string,
  place: Pick<ListMapPlace | NearbyPlace, 'address' | 'addressKo'>,
) => {
  return language.startsWith('ko') && place.addressKo ? place.addressKo : place.address
}

export const mapPlaces: MapPlace[] = [
  {
    id: 'food-1',
    name: 'Korean BBQ',
    nameKo: '불고기마당',
    category: 'food',
    x: 22,
    y: 51,
    icon: foodIcon,
    detailPlaceId: 'nearby-1',
  },
  {
    id: 'food-2',
    name: 'Tasty Noodle',
    nameKo: '면맛집',
    category: 'food',
    x: 71,
    y: 58,
    icon: foodIcon,
    detailPlaceId: 'nearby-2',
  },
  {
    id: 'cafe-1',
    name: 'Morning Bean',
    nameKo: '모닝빈',
    category: 'cafe',
    x: 61,
    y: 40,
    icon: cafeIcon,
    detailPlaceId: 'nearby-3',
  },
  {
    id: 'cafe-2',
    name: 'Quiet Brew',
    nameKo: '퀴엇브루',
    category: 'cafe',
    x: 35,
    y: 68,
    icon: cafeIcon,
    detailPlaceId: 'nearby-1',
  },
  {
    id: 'prayer-1',
    name: 'Peace Place',
    nameKo: '평화공간',
    category: 'prayer',
    x: 80,
    y: 34,
    icon: prayerIcon,
    detailPlaceId: 'nearby-2',
  },
]

export const listMapPlaces: ListMapPlace[] = [
  {
    id: 'list-map-1',
    name: 'Dajunghan Korean Restaurant',
    nameKo: '다정한 식당',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 1,
    category: 'food',
    x: 22,
    y: 53,
  },
  {
    id: 'list-map-2',
    name: 'Andong Galbi Korean Restaurant',
    nameKo: '안동갈비 식당',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
    category: 'food',
    x: 62,
    y: 42,
  },
  {
    id: 'list-map-3',
    name: 'Oozy Coffee',
    nameKo: '오지커피',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 3,
    category: 'cafe',
    x: 70,
    y: 58,
  },
  {
    id: 'list-map-4',
    name: 'Sunny Mood Cafe',
    nameKo: '써니무드카페',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
    category: 'cafe',
    x: 40,
    y: 66,
  },
]

export const nearbyPlacesData: NearbyPlace[] = [
  {
    id: 'nearby-1',
    name: 'Haneul Korean Restaurant',
    nameKo: '하늘한식당',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 1,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-2',
    name: 'Andong Galbi House',
    nameKo: '안동갈비집',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-3',
    name: 'Dajunghan Korean Restaurant',
    nameKo: '다정한 식당',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 3,
    photoUrl: photoFood,
  },
  {
    id: 'nearby-4',
    name: 'Hansarang Food',
    nameKo: '한사랑 푸드',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-5',
    name: 'Hansarang Food',
    nameKo: '한사랑 푸드',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-6',
    name: 'Hansarang Food',
    nameKo: '한사랑 푸드',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'nearby-7',
    name: 'Hansarang Food',
    nameKo: '한사랑 푸드',
    status: 'Closed',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
]

export const searchResultPlacesData: NearbyPlace[] = [
  {
    id: 'search-1',
    name: 'Dajunghan Korean Restaurant',
    nameKo: '다정한 식당',
    status: 'Open',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 1층 107호, 장안구',
    detailType: 2,
  },
  {
    id: 'search-2',
    name: 'Seobu Halal Kitchen',
    nameKo: '서부 할랄 키친',
    status: 'Open',
    address: '2129-1, Seobu-ro, Jangan-gu',
    addressKo: '서부로 2129-1, 장안구',
    detailType: 2,
  },
  {
    id: 'search-3',
    name: 'Campus Food Court',
    nameKo: '캠퍼스 푸드코트',
    status: 'Closed',
    address: 'Yeongtong-gu, Suwon-si',
    addressKo: '수원시 영통구',
    detailType: 2,
  },
  {
    id: 'search-4',
    name: 'Suwon Rice Bowl',
    nameKo: '수원 라이스볼',
    status: 'Open',
    address: '33, Hwaseong-ro, Paldal-gu',
    addressKo: '화성로 33, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-5',
    name: 'Morning Noodle Bar',
    nameKo: '모닝 누들 바',
    status: 'Open',
    address: '18, Seodun-dong, Paldal-gu',
    addressKo: '서둔동 18, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-6',
    name: 'Han River Snack House',
    nameKo: '한강 간식집',
    status: 'Closed',
    address: '91, Ingye-ro, Paldal-gu',
    addressKo: '인계로 91, 팔달구',
    detailType: 2,
  },
  {
    id: 'search-7',
    name: 'Golden Spoon Cafe',
    nameKo: '골든 스푼 카페',
    status: 'Open',
    address: '12, Maetan-ro, Yeongtong-gu',
    addressKo: '매탄로 12, 영통구',
    detailType: 2,
  },
  {
    id: 'search-8',
    name: 'Seobu Corner Diner',
    nameKo: '서부 코너 식당',
    status: 'Closed',
    address: '44, Seobu-ro, Jangan-gu',
    addressKo: '서부로 44, 장안구',
    detailType: 2,
  },
  {
    id: 'search-9',
    name: 'Campus Bunsik',
    nameKo: '캠퍼스 분식',
    status: 'Open',
    address: '205, Gwacheon-daero, Jangan-gu',
    addressKo: '과천대로 205, 장안구',
    detailType: 2,
  },
  {
    id: 'search-10',
    name: 'Open Table Kitchen',
    nameKo: '오픈 테이블 키친',
    status: 'Open',
    address: '78, Gangnam-ro, Suwon-si',
    addressKo: '강남로 78, 수원시',
    detailType: 2,
  },
  {
    id: 'search-11',
    name: 'Rice & Bowl Market',
    nameKo: '라이스 앤 보울 마켓',
    status: 'Closed',
    address: '9, Wolhwa-ro, Suwon-si',
    addressKo: '월화로 9, 수원시',
    detailType: 2,
  },
  {
    id: 'search-12',
    name: 'Little Seoul Eatery',
    nameKo: '리틀 서울 이터리',
    status: 'Open',
    address: '61, Hwaseong-si, Gyeonggi-do',
    addressKo: '화성시 61, 경기도',
    detailType: 2,
  },
]
