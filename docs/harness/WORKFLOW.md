# AI-Assisted Development Workflow

## 1. Define the Request as User Behavior

나쁜 시작:

```text
컴포넌트 하나 만들어줘
```

좋은 시작:

```text
Explore에서 사용자가 지역명을 검색하면 280ms debounce 후 결과가 갱신되고,
실패 시 재시도 버튼을 볼 수 있게 해줘.
```

## 2. Identify the Impact Scope First

다음 순서로 필요한 파일만 탐색한다.

```text
route → view → component → service → type → i18n
```

모든 파일을 무작정 읽지 않는다.

## 3. Separate Planning from Implementation

구현 전에 다음을 짧게 확정한다.

- 변경할 파일
- 유지해야 할 기존 contract
- 새로 생기는 상태
- 실패/빈 상태
- 검증 방법

## 4. Implement in Small Changes

한 프롬프트에서 서로 무관한 기능을 동시에 구현하지 않는다.

예:

```text
1) API/type 연결
2) view 상태 연결
3) component UI
4) error/empty/mobile 보완
5) 검증
```

## 5. Verification Loop

```bash
npm run type-check
npm run lint
git diff
npm run build
```

기능에 따라 수동 확인을 추가한다.

- Places: 검색 debounce, 카테고리 변경, 이미지 없음
- Festivals: 월 전환, 날짜 범위, 페이지 경계
- Community: 작성/수정/삭제/좋아요/댓글 실패
- Chatbot: 빠른 연속 전송, 언어 전환, API 오류

## 6. Update the Harness During Review

같은 종류의 문제가 반복되면 일회성 프롬프트에만 남기지 않는다.

- 모든 작업에 해당 → `AGENTS.md` 또는 `copilot-instructions.md`
- 특정 경로에만 해당 → `.github/instructions`
- 특정 도메인 지식 → `docs/harness/features`
- 반복 실행 절차 → `.github/prompts`

이렇게 해야 팀의 시행착오가 다음 작업의 기본값으로 축적된다.
