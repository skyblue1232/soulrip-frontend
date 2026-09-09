# Verification Checklist

## Common

- [ ] 요청한 사용자 행동이 구현되었는가?
- [ ] 관련 없는 파일이 바뀌지 않았는가?
- [ ] `any` 또는 임의의 백엔드 필드를 추가하지 않았는가?
- [ ] loading / error / empty 상태를 확인했는가?
- [ ] 모바일 폭에서 핵심 조작이 가능한가?
- [ ] 아이콘 버튼/입력/이미지 접근성을 확인했는가?
- [ ] 비밀번호/API 키/환경값을 코드나 로그에 노출하지 않았는가?

## Places

- [ ] 카테고리 `ALL`과 개별 카테고리 모두 동작하는가?
- [ ] 검색 공백 trim/debounce가 의도대로 동작하는가?
- [ ] 이미지/지역/좌표/soloScore가 없을 때 깨지지 않는가?
- [ ] 카드에서 상세 id가 올바르게 전달되는가?

## Festivals

- [ ] start/end date null을 처리하는가?
- [ ] 단일일/기간 축제 모두 올바른가?
- [ ] 월 변경 시 페이지/선택 날짜가 일관적인가?
- [ ] 1페이지/마지막 페이지 경계가 올바른가?
- [ ] 날짜가 시간대 때문에 하루 밀리지 않는가?

## Community

- [ ] 익명 작성 플로우를 유지하는가?
- [ ] 비밀번호가 불필요하게 저장/로그되지 않는가?
- [ ] 좋아요 중복 동작을 막는가?
- [ ] 댓글 생성 후 count와 목록이 일치하는가?
- [ ] mutation 중 버튼 중복 클릭을 막는가?

## Chatbot

- [ ] 빈 메시지를 보내지 않는가?
- [ ] loading 중 중복 전송을 막는가?
- [ ] 최근 history와 language가 함께 전달되는가?
- [ ] API 실패 시 사용자가 오류 상태를 알 수 있는가?
- [ ] 언어 전환 후 초기 메시지/버튼 문구가 일관적인가?

## Automated Verification

```bash
npm run type-check
npm run lint
git diff
npm run build
```

`npm run lint`가 파일을 수정할 수 있으므로 반드시 diff를 다시 본다.
