# Soulrip Project Context

## Service Summary

Soulrip은 **혼자 서울을 여행하는 사용자가 장소를 발견하고, 여행 선택지를 구체화하고, 익명으로 경험을 공유하는 AI 기반 Solo Travel Hub**다.

## Project Constraints

- 단기 팀 프로젝트에서 만들어진 프론트엔드다.
- Vue 3 + TypeScript + Vite를 사용한다.
- 백엔드 API는 FastAPI 계열의 에러 응답을 사용한다.
- 데이터 도메인은 서울 관광/문화/레포츠/쇼핑/숙박/여행코스/축제와 익명 커뮤니티다.
- 과도한 엔터프라이즈 추상화보다 빠르게 이해 가능한 단순한 구조가 중요하다.

## Core User Flows

### Discover Solo

`/explore`에서 카테고리 또는 검색어로 장소를 찾고, 카드에서 상세 화면으로 이동한다.

### Plan Solo

`/festivals`에서 월/날짜 단위로 축제를 탐색하고, 전역 챗봇에서 여행 관련 질문을 한다.

### Share Solo

`/community`에서 로그인 없이 게시글/댓글을 작성하고 다른 혼행자의 경험을 참고한다.

## UX Principles

- 처음 서울을 방문하는 사용자도 이해하기 쉬운 표현을 우선한다.
- 목록은 이미지 중심 탐색 경험을 제공한다.
- 모바일에서도 필터/카드/챗봇을 사용할 수 있어야 한다.
- API 응답이 느리거나 실패해도 사용자가 현재 상태를 알 수 있어야 한다.
- 정보가 누락된 공공데이터를 정상 케이스로 취급한다.

## Questions Before AI Changes

1. 이 변경은 어느 사용자 흐름(Discover/Plan/Share)에 속하는가?
2. 기존 도메인 타입과 API 메서드로 표현 가능한가?
3. 새 상태가 view에 있어야 하는가, component/composable로 내려가야 하는가?
4. 네트워크 상태와 null 데이터를 처리했는가?
5. 다국어/모바일/접근성에 영향이 있는가?
6. 기존 route/API/localStorage contract를 깨지 않는가?
