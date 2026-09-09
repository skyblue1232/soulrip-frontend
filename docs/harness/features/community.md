# Community Domain Guide

## Role

로그인 없이 혼행 경험을 공유하는 익명 커뮤니티다. 일반 이야기, 혼밥/장소 추천, 여행 후기, 동행 모집 유형을 지원한다.

## Key Files

- `CommunityListView.vue`
- `CommunityFormView.vue`
- `CommunityDetailView.vue`
- `PostCard.vue`
- `src/services/api.ts`
- `src/types/index.ts`

## Core Contract

`PostType`:

```text
ALL / GENERAL / FOOD / REVIEW / COMPANION
```

게시글 생성/수정 payload에는 type, title, content, nickname, password, tags가 포함된다.

## Anonymity and Security

- 비밀번호는 작성/수정/삭제 권한 확인을 위한 값이다.
- 비밀번호를 localStorage나 장기 상태에 저장하지 않는다.
- 화면/console에 비밀번호를 출력하지 않는다.
- 좋아요 식별은 현재 브라우저 `client_id`를 `crypto.randomUUID()`로 만들고 localStorage에 저장하는 방식이다.

## State Consistency

- 댓글 생성 성공 시 새 댓글을 목록에 추가하고 `post.commentCount`도 증가시킨다.
- 좋아요 성공 시 backend 응답의 `liked`, `likesCount`를 source of truth로 반영한다.
- 삭제 성공 시 커뮤니티 목록으로 이동한다.
- mutation 중에는 중복 요청을 막는다.

## Change Considerations

인증 시스템을 새로 추가하는 작업이 아니라면 익명 사용 모델을 깨는 전제(회원 id 필수 등)를 도입하지 않는다.
