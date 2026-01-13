# AGENTS.md - Basclub Project Guidelines

## Commands

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production
npm run lint            # TypeScript + ESLint
tsc --noEmit          # Type check
vitest <file.spec.ts>  # Run single test
vitest -t "pattern"  # Run matching tests
```

## Architecture

**Tech Stack**: Next.js 14, TS5, TypeORM 0.3, TanStack Query, PostgreSQL, Vitest

```
src/entity/     # TypeORM entities
src/feature/    # Service, hooks, queries, mutations
src/share/       # Shared utils, DI container
src/app/         # App Router (pages, API, UI)
```

## Code Style

### Imports

**Absolute paths only** with `@/`. Group: entities → features → share → external.

```typescript
import { Member } from "@/entity/member.entity";
import { MemberService } from "@/feature/member/member.service";
import { api } from "@/share/lib/ky";
import { NextResponse } from "next/server";
```

### Types

**Strict mode** - Explicit types. Use `ReturnType` for derived types.

```typescript
interface Props {
  title: string;
  onClick: () => void;
}
export type PlainMember = ReturnType<Member["toPlain"]>;
```

### Naming

| Context          | Convention              | Examples                                |
| ---------------- | ----------------------- | --------------------------------------- |
| Vars/Functions   | camelCase               | `userId`, `handleSubmit`                |
| Classes/Entities | PascalCase              | `MemberService`, `Keyword`              |
| Interfaces       | PascalCase (I optional) | `IKeywordAccordionProps`                |
| DB columns       | snake_case              | `@Column({ name: "profileUrl" })`       |
| Types            | PascalCase              | `PlainMember`, `IPayLoad`               |
| Hooks            | camelCase + 'use'       | `useFetchOwn`, `useKeywords`            |
| Components       | PascalCase              | `MemberProfile`, `DisplayParticipants`  |
| API routes       | PascalCase exports      | `export const GET`, `export const POST` |

### Entity Pattern

```typescript
@Entity({ name: "member" })
export class Member extends TimeStampEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id: string;

  @Column({ length: 50, nullable: false })
  nickname: string;

  toPlain() {
    return { id: this.id, nickname: this.nickname };
  }
}
export type PlainMember = ReturnType<Member["toPlain"]>;
```

### Service Pattern

```typescript
@Service
export class MemberService implements IService<Member> {
  @InjectRepository(Member)
  private memberRepository: Repository<Member>;

  async findById(id: string) {
    return this.memberRepository.findOne({ where: { id } });
  }

  async getRepository() {
    return this.memberRepository;
  }
}
```

### API Routes

```typescript
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const service = getService(MemberService);
    const result = await service.findById(memberId);

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.toPlain());
  } catch (error) {
    return NextResponse.json({ error: "Failed: " + error }, { status: 500 });
  }
};
```

**Status Codes**: 200, 201, 400, 401, 403, 404, 409, 500

### React Components

```typescript
"use client";
interface Props { title: string; onClick: () => void; }
export const Button: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### TanStack Query Hooks

```typescript
export const memberQueryApi = {
  findById: (id: string, enabled = true) =>
    queryOptions({
      queryKey: ["member", id],
      queryFn: () => api.get(`${id}`).json<PlainMember>(),
      staleTime: 1000 * 60 * 30,
      enabled,
    }),
};

export const useMutationX = () => {
  return useMutation({
    mutationFn: (data) => api.post("endpoint", { json: data }),
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: ["key"] });
    },
  });
};

const { mutate } = useMutationX();
useCallback(() => mutate(), [mutate]);
```

### Error Handling

- API Routes: try/catch with NextResponse
- Services: Throw errors
- Components/Hooks: Return error state
- Tests: Korean comments allowed

### Testing

```typescript
import { describe, test, expect, beforeEach } from "vitest";

describe("ServiceName - Feature", () => {
  beforeEach(() => {});
  test("should do something", () => {
    expect(actual).toBe(expected);
  });
});
```

Files: `*.spec.ts`. Mocks in `vitest.setup.ts`.

### Linting

- Unused vars: start with `_`
- Never suppress: no `as any`, `@ts-ignore`
- Prettier: Tailwind class auto-sorting

## Database

PostgreSQL + TypeORM. `synchronize: false`. CASCADE deletes. Serverless pooling (max:1, min:0).

## UI

Flowbite React + Tailwind CSS. Classes auto-sorted.

## Best Practices

1. Run `npm run lint` before commit
2. Follow `member.service.ts` patterns
3. Type everything - strict mode
4. Proper HTTP status codes
5. TanStack Query for all API calls
6. Minimal comments - self-documenting
7. Async/await only
8. Destructure imports
9. Test services/complex logic
10. Korean comments in tests OK
