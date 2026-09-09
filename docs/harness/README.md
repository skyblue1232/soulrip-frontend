# Soulrip Harness Engineering Guide

이 폴더와 `.github` 커스터마이징 파일들은 Soulrip 프론트엔드에서 AI 코딩 도구가 프로젝트 맥락을 반복해서 설명받지 않아도 일관된 방식으로 작업하도록 만드는 하네스다.

## Why This Structure

하네스의 핵심은 모델에게 모든 문서를 항상 주입하는 것이 아니라, **현재 작업에 필요한 프로젝트 지식과 워크플로만 선택적으로 제공하는 것**이다.

Soulrip에서는 다음 네 층으로 나눈다.

```text
Global     AGENTS.md + .github/copilot-instructions.md
Domain     docs/harness/features/*.md
Local      .github/instructions/*.instructions.md
Workflow   .github/prompts/*.prompt.md
```

- Global: 어떤 작업에서도 지켜야 하는 아키텍처/검증 원칙
- Domain: 장소, 축제, 커뮤니티, 챗봇의 비즈니스 맥락
- Local: 특정 경로 파일을 수정할 때만 자동 적용되는 규칙
- Workflow: 반복 작업을 slash command처럼 실행하는 작업 절차

규칙과 워크플로를 분리하면 프로젝트 설명과 작업 방법이 뒤섞이지 않고, 파일 경로에 따라 필요한 규칙만 적용할 수 있다.

## Repository Placement

이 팩의 **내용 전체를 `soulrip-frontend` 저장소 루트에 그대로 복사**한다.

최종 구조는 다음과 같아야 한다.

```text
soulrip-frontend/
├─ AGENTS.md
├─ .github/
│  ├─ copilot-instructions.md
│  ├─ instructions/
│  │  ├─ api-service.instructions.md
│  │  ├─ composables.instructions.md
│  │  ├─ i18n.instructions.md
│  │  ├─ router.instructions.md
│  │  ├─ styles.instructions.md
│  │  ├─ types.instructions.md
│  │  ├─ views.instructions.md
│  │  └─ vue-components.instructions.md
│  └─ prompts/
│     ├─ bugfix.prompt.md
│     ├─ chatbot-feature.prompt.md
│     ├─ community-feature.prompt.md
│     ├─ festival-feature.prompt.md
│     ├─ new-feature.prompt.md
│     ├─ place-feature.prompt.md
│     ├─ refactor.prompt.md
│     └─ review.prompt.md
├─ docs/
│  └─ harness/
│     ├─ README.md
│     ├─ ARCHITECTURE.md
│     ├─ FEATURE_MAP.md
│     ├─ PROJECT_CONTEXT.md
│     ├─ PROMPT_CHEATSHEET.md
│     ├─ VERIFICATION_CHECKLIST.md
│     ├─ WORKFLOW.md
│     └─ features/
│        ├─ chatbot.md
│        ├─ community.md
│        ├─ festivals.md
│        └─ places.md
└─ src/
   └─ ... 기존 코드
```

기존 `README.md`, `src`, `package.json`은 덮어쓰지 않는다. 이 팩은 위의 새 파일만 추가한다.

## How It Works with VS Code + GitHub Copilot

### 1. Repository-wide Rules

`.github/copilot-instructions.md`는 저장소 전체 Copilot 요청에 프로젝트 기본 맥락을 제공한다.

### 2. Path-specific Rules

`.github/instructions/*.instructions.md`는 `applyTo` glob과 일치하는 파일을 작업할 때 자동으로 적용된다.

예를 들어 `src/services/api.ts`를 수정하면 API 서비스 규칙이 적용되고, `src/components/PlaceCard.vue`를 수정하면 컴포넌트 규칙이 적용된다.

### 3. Reusable Task Prompts

`.github/prompts/*.prompt.md`는 VS Code Copilot Chat에서 `/`로 호출할 수 있는 재사용 워크플로다.

예시:

```text
/soulrip-place-feature
/soulrip-community-feature
/soulrip-bugfix
/soulrip-review
```

프롬프트 파일 기능은 VS Code 버전에 따라 Preview 기능일 수 있다. 목록에 보이지 않는 경우 최신 VS Code/GitHub Copilot 확장을 확인하고 Agent Customizations 또는 Prompt Files 설정을 확인한다.

## Recommended Workflow

새 기능:

```text
/soulrip-new-feature
```

도메인이 명확하면:

```text
/soulrip-place-feature
/soulrip-festival-feature
/soulrip-community-feature
/soulrip-chatbot-feature
```

버그:

```text
/soulrip-bugfix
```

리팩터링:

```text
/soulrip-refactor
```

PR 전 자체 리뷰:

```text
/soulrip-review
```

## Rule Maintenance Principles

1. LLM이 이미 아는 Vue/TypeScript 일반 문법 설명은 최소화한다.
2. Soulrip에만 해당하는 규칙과 반복되는 실수만 추가한다.
3. 같은 지시를 여러 파일에 복붙하지 않는다.
4. 코드 구조가 바뀌면 하네스 문서도 같은 PR에서 갱신한다.
5. 새 규칙은 실제 실패/리뷰 사례가 반복될 때 추가한다.
6. 규칙이 너무 길어지면 Global이 아니라 Domain/Local 계층으로 내린다.

## Design References

- Rules와 Skills를 분리해 코드 규칙과 반복 워크플로를 구분한다.
- 경로 기반 규칙으로 불필요한 컨텍스트 주입을 줄인다.
- 저장소 안의 실행 가능한 지식을 SSOT로 두고, 필요한 맥락을 Global/Domain/Local 계층으로 나눈다.
- AI 산출물은 개발자가 이해하고 검증하며, 코드 품질과 보안 책임을 AI에 위임하지 않는다.
