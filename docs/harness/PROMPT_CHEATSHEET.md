# Soulrip AI Collaboration Cheat Sheet

## New Feature

```text
/soulrip-new-feature feature="장소 상세에 지도 fallback 추가"
```

## Places

```text
/soulrip-place-feature change="검색 결과에 현재 카테고리 결과 수를 표시"
```

## Festivals

```text
/soulrip-festival-feature change="월 변경 후 선택 날짜를 해당 월의 첫 축제일로 맞춤"
```

## Community

```text
/soulrip-community-feature change="댓글 작성 실패 시 입력 내용은 유지"
```

## Chatbot

```text
/soulrip-chatbot-feature change="ChatResponse.sources를 답변 아래 카드로 표시"
```

## Bug Fix

```text
/soulrip-bugfix bug="축제 페이지 마지막 페이지에서 월 변경 시 빈 목록이 보임"
```

## Refactoring

```text
/soulrip-refactor target="CommunityDetailView의 댓글 상태/행동이 너무 커져 읽기 어려움"
```

## Review

```text
/soulrip-review scope="현재 git diff"
```

## Minimal Template for Free-form Prompts

```text
[목표]
사용자가 무엇을 할 수 있어야 하는지

[제약]
기존 route/API/type 유지 여부

[먼저 확인]
관련 기존 구현을 찾고 변경 계획부터 제시

[완료 조건]
loading/error/empty + mobile + type-check/lint/build
```

## Correction Prompts

```text
새 패턴을 만들지 말고 가장 가까운 기존 구현을 찾아 동일한 구조로 다시 설계해줘.
```

```text
현재 변경만 남기고 관련 없는 리팩터링은 되돌리는 방향으로 최소 diff를 제안해줘.
```

```text
추측한 백엔드 contract와 코드에서 확인된 contract를 분리해서 표시해줘.
```
