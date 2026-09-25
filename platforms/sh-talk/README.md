# SH톡 — SH그룹 사내 메신저

- **제작:** 기술팀장 잡스
- **링크:** https://claude.ai/artifact/KMj3x3LBCMtvuEw1ep1wkc (비공개 — 공유는 페이지의 공유 메뉴에서)
- **파일:** `index.html` (단일 파일)

## 기능
- 휴대폰형 화면, 하단 탭: 친구 / 채팅 / 공지
- SH그룹 전체방 + 머스크·버핏·잡스 1:1 방
- 전체방은 기본 머스크가 답하고, `@버핏`, `@잡스`처럼 부르면 해당 임원이 답함
- 공지는 회장님(소유자)만 작성

## 게시 설정 (capabilities)
```
db:     { rules: [ { path: "notices", write: "owner" }, { path: "meta", write: "owner" } ] }
sample: {}
user:   { scopes: ["profile"] }
```

## DB 구조
| 컬렉션 | 필드 |
|--------|------|
| `messages` | `room` (`group` 또는 `dm-<임원>-<userId>`), `sender`, `senderType` (`human`/`agent`), `agent?`, `text`, `createdAt` |
| `notices` | `title`, `body`, `createdAt`, `pinned` |
| `meta/app` | `ownerId` |

## 알려진 한계
- 메시지 1건 = 문서 1개, DB 한도 5,000건 → 장기 운영 시 오래된 메시지 정리 기능 필요
- 1:1 방은 같은 DB를 쓰므로 완전한 비공개가 아님
- AI 임원 답장은 메시지를 보낸 사람의 Claude 사용량을 씀
