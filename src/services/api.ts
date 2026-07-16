import type {
  ChatHistoryItem,
  ChatResponse,
  CommunityPost,
  Festival,
  Place,
  PostPayload,
  PostType,
  PaginationMeta,
  LikeResponse,
  TodayInsightResponse,
} from '@/types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '')


async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: '요청 처리 중 오류가 발생했습니다.' }))

    throw new Error(
      error.detail || '요청 처리 중 오류가 발생했습니다.'
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}


export const api = {

  // 장소 목록
  async getPlaces(
    params: {
      category?: string
      search?: string
      page?: number
      size?: number
    } = {}
  ) {
    const query = new URLSearchParams()

    const contentTypes: Record<string, string[]> = {
      TOUR: ['12'],
      LEISURE: ['28'],
      CULTURE: ['14'],
      SHOPPING: ['38'],
      ACCOMMODATION: ['32'],
      COURSE: ['25'],
      FESTIVAL: ['15'],
    }

    if (params.category && params.category !== 'ALL') {
      for (const contentType of contentTypes[params.category] || []) {
        query.append('contentType', contentType)
      }
    }

    if (params.search?.trim()) {
      query.set('q', params.search.trim())
    }

    if (params.page) {
      query.set('page', String(params.page))
    }

    if (params.size) {
      query.set('size', String(params.size))
    }

    return request<{
      items: Place[]
      meta: PaginationMeta
    }>(`/places?${query}`)
  },


  // 장소 상세
  getPlace(id: number) {
    return request<Place>(`/places/${id}`)
  },


  // 축제 목록
  async getFestivals(
    month?: number | null
  ) {
    const query = month
      ? `?month=${month}`
      : ''

    return request<{
      items: Festival[]
      meta: PaginationMeta
    }>(`/festivals${query}`)
  },


  // 축제 상세
  getFestival(contentId: string) {
    return request<Festival>(`/festivals/${contentId}`)
  },


  // 게시글 목록
  async getPosts(
    params: {
      postType?: PostType
      search?: string
      page?: number
      size?: number
    } = {}
  ) {
    const query = new URLSearchParams()

    if (
      params.postType &&
      params.postType !== 'ALL'
    ) {
      query.set('type', params.postType)
    }

    if (params.search) {
      query.set('search', params.search)
    }

    if (params.page) {
      query.set('page', String(params.page))
    }

    if (params.size) {
      query.set('size', String(params.size))
    }


    return request<{
      items: CommunityPost[]
      meta: PaginationMeta
    }>(`/posts?${query}`)
  },


  // 게시글 상세
  getPost(id: number) {
    return request<CommunityPost>(`/posts/${id}`)
  },


  // 게시글 생성
  createPost(payload: PostPayload) {
    return request<CommunityPost>(
      '/posts',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },


  // 게시글 수정
  updatePost(
    id: number,
    payload: PostPayload
  ) {
    return request<CommunityPost>(
      `/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    )
  },


  // 게시글 삭제
  deletePost(
    id: number,
    password: string
  ) {
    return request<void>(
      `/posts/${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          password,
        }),
      }
    )
  },


  // 좋아요
  likePost(
    id: number,
    clientId: string
  ) {
    return request<LikeResponse>(
      `/posts/${id}/like`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
        }),
      }
    )
  },


  // 챗봇
  chat(
    message: string,
    history: ChatHistoryItem[],
    language: string = 'ko',
  ) {
    return request<ChatResponse>(
      '/chat',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          history,
          language,
        }),
      }
    )
  },

  // 오늘의 AI 인사이트
  getTodayInsight() {
    return request<TodayInsightResponse>(
      '/ai-insights/today',
      {
        method: 'POST',
      }
    )
  },
}
