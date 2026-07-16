import type {
  ChatHistoryItem,
  ChatResponse,
  CommunityPost,
  Festival,
  LikeResponse,
  PaginationMeta,
  Place,
  PostPayload,
  PostType,
  TodayInsightResponse,
} from '@/types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '')

type FastApiErrorItem = {
  loc?: Array<string | number>
  msg?: string
  type?: string
}

type ApiErrorResponse = {
  detail?: string | FastApiErrorItem[]
  message?: string
}

/**
 * FastAPI 오류 응답을 사용자가 읽을 수 있는 문자열로 변환
 */
function getErrorMessage(error: ApiErrorResponse): string {
  if (typeof error.detail === 'string') {
    return error.detail
  }

  if (Array.isArray(error.detail)) {
    return error.detail
      .map((item) => {
        const field = item.loc?.at(-1)
        const message = item.msg || '요청 값이 올바르지 않습니다.'

        return field
          ? `${String(field)}: ${message}`
          : message
      })
      .join('\n')
  }

  if (typeof error.message === 'string') {
    return error.message
  }

  return '요청 처리 중 오류가 발생했습니다.'
}

async function request<T>(
  path: string,
  options: RequestInit = {},
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
      .catch((): ApiErrorResponse => ({
        detail: '요청 처리 중 오류가 발생했습니다.',
      }))

    throw new Error(getErrorMessage(error))
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
    } = {},
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

    const queryString = query.toString()

    return request<{
      items: Place[]
      meta: PaginationMeta
    }>(
      `/places${queryString ? `?${queryString}` : ''}`,
    )
  },

  // 장소 상세
  getPlace(id: number) {
    return request<Place>(`/places/${id}`)
  },

  // 축제 목록
  async getFestivals(month?: number | null) {
    const query = month
      ? `?month=${encodeURIComponent(String(month))}`
      : ''

    return request<{
      items: Festival[]
      meta: PaginationMeta
    }>(`/festivals${query}`)
  },

  // 축제 상세
  getFestival(contentId: string) {
    return request<Festival>(
      `/festivals/${encodeURIComponent(contentId)}`,
    )
  },

  // 게시글 목록
  async getPosts(
    params: {
      postType?: PostType
      search?: string
      page?: number
      size?: number
    } = {},
  ) {
    const query = new URLSearchParams()

    if (
      params.postType &&
      params.postType !== 'ALL'
    ) {
      query.set('type', params.postType)
    }

    if (params.search?.trim()) {
      query.set('q', params.search.trim())
    }

    if (params.page) {
      query.set('page', String(params.page))
    }

    if (params.size) {
      query.set('limit', String(params.size))
    }

    const queryString = query.toString()

    return request<{
      items: CommunityPost[]
      meta: PaginationMeta
    }>(
      `/posts${queryString ? `?${queryString}` : ''}`,
    )
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
      },
    )
  },

  // 게시글 수정
  // 백엔드에 PUT /posts/{id} 라우터가 있어야 동작함
  updatePost(
    id: number,
    payload: PostPayload,
  ) {
    return request<CommunityPost>(
      `/posts/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
    )
  },

  // 게시글 삭제
  // 백엔드가 password를 query parameter로 요구함
  deletePost(
    id: number,
    password: string,
  ) {
    const query = new URLSearchParams({
      password,
    })

    return request<void>(
      `/posts/${id}?${query.toString()}`,
      {
        method: 'DELETE',
      },
    )
  },

  // 좋아요
  likePost(
    id: number,
    clientId: string,
  ) {
    return request<LikeResponse>(
      `/posts/${id}/likes`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
        }),
      },
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
      },
    )
  },

  // 오늘의 AI 인사이트
  getTodayInsight() {
    return request<TodayInsightResponse>(
      '/ai-insights/today',
      {
        method: 'POST',
      },
    )
  },
}