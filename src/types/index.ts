export type Lang =
  | 'ko'
  | 'en'
  | 'ja'
  | 'zh'
  | 'fr'
  | 'es'
  | 'de'
  
export type PlaceCategory =
  | 'ALL'
  | 'TOUR'
  | 'LEISURE'
  | 'CULTURE'
  | 'SHOPPING'
  | 'ACCOMMODATION'
  | 'COURSE'
  | 'FESTIVAL'

export type PostType =
  | 'ALL'
  | 'GENERAL'
  | 'FOOD'
  | 'REVIEW'
  | 'COMPANION'

// 장소
export interface Place {
  id: number
  contentId: string
  contentTypeId: number
  contentType: string
  title: string
  name: string
  address: string
  addressDetail: string
  district: string | null
  zipcode: string
  phone: string
  longitude: number | null
  latitude: number | null
  mapLevel: number | null
  imageUrl: string
  thumbnailUrl: string
  category: string
  tags: string[]
  soloScore: number | null
  isFeatured: boolean
}

// 축제
export interface Festival {
  id: number
  contentId: string
  name: string
  title: string
  startDate: string | null
  endDate: string | null
  location: string
  addressDetail: string
  district: string | null
  category: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  longitude: number | null
  latitude: number | null
  phone: string
  dateAvailable: boolean
}

// 커뮤니티
export interface CommunityPost {
  id: number
  type: string
  title: string
  content: string
  nickname: string
  tags: string[]
  views: number
  likes: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface PostPayload {
  type: string
  title: string
  content: string
  nickname: string
  password: string
  tags: string[]
}

// 댓글 (추가)
export interface Comment {
  id: number
  post_id: number
  content: string
  nickname: string
  created_at: string
  updated_at: string
}

// 챗봇
export interface ChatHistoryItem {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatSource {
  type: string
  id: string
  title: string
  subtitle: string
  image_url: string
}

export interface ChatResponse {
  answer: string
  sources: ChatSource[]
  suggestions: string[]
  used_ai: boolean
}

export interface PaginationMeta {
  total: number
  page: number
  size: number
  pages: number
}

export interface LikeResponse {
  liked: boolean
  likes_count: number
}

// 오늘의 AI 인사이트
export interface TodayInsightItem {
  label: string
  headline: string
  description: string
  image_url: string
}

export interface TodayInsightResponse {
  today: TodayInsightItem
  time: TodayInsightItem
  place: TodayInsightItem
  tip: TodayInsightItem
}
