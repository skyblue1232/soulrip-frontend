# Chatbot Domain Guide

## Role

Soulrip의 전역 AI 챗봇은 사용자가 서울 혼행 관련 장소/혼밥/축제 질문을 자연어로 탐색하도록 돕는다.

## Key Files

- `src/components/ChatBot.vue`
- `src/services/api.ts`: `chat`
- `src/types/index.ts`: `ChatHistoryItem`, `ChatSource`, `ChatResponse`
- `src/composables/useApp.ts`: 현재 언어

## Request Contract

```text
POST /chat
message
history
language
```

현재 UI는 새 user 메시지를 먼저 history에 넣은 뒤 최근 8개 메시지를 backend에 전달한다.

## Response Contract

`ChatResponse`에는 다음 필드가 정의되어 있다.

- `answer`
- `sources`
- `suggestions`
- `used_ai`

새 UI를 만들 때 source/suggestion을 별도 임의 타입으로 만들지 말고 이 응답을 우선 활용한다.

## UX Invariants

- 공백 메시지는 전송하지 않는다.
- loading 중 중복 전송을 차단한다.
- 전송/응답 뒤 최신 메시지로 스크롤한다.
- 실패하면 사용자가 오류를 인지할 수 있는 assistant 메시지를 추가한다.
- 언어 전환 시 초기 인사말이 남아 있다면 현재 언어에 맞춰 갱신한다.

## i18n

챗봇 UI 사전은 현재 7개 언어를 동일한 key 형태로 갖는다. 한 언어에만 key를 추가하지 않는다.

## Security

클라이언트 코드에 system prompt, OpenAI API key, backend secret을 넣지 않는다. 모델 호출에 필요한 비밀은 서버에서 관리한다.
