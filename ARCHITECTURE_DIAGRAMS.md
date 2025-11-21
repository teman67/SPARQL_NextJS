# 🏗️ SPARQL Query Explorer - Architecture Diagrams

Visual representations to help explain the application architecture during your interview.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Application (CSR)                  │ │
│  │                                                          │ │
│  │  ┌──────────────┐    ┌─────────────┐   ┌────────────┐ │ │
│  │  │  Components  │    │ TanStack    │   │   Lib      │ │ │
│  │  │  - QueryForm │◄───│   Query     │──►│ Functions  │ │ │
│  │  │  - Results   │    │  (Cache)    │   │ - fetch    │ │ │
│  │  │    Table     │    │             │   │ - validate │ │ │
│  │  └──────────────┘    └─────────────┘   └────────────┘ │ │
│  │                                                          │ │
│  └─────────────────────────┬────────────────────────────── │ │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP GET
                             │ (SPARQL query in URL)
                             ▼
                ┌──────────────────────────┐
                │  DBpedia SPARQL Endpoint │
                │  https://dbpedia.org     │
                │                          │
                │  - Processes query       │
                │  - Returns JSON          │
                └──────────────────────────┘
```

---

## 2. Component Hierarchy

```
RootLayout (layout.tsx)
│
├─► Providers (providers.tsx)
│   └─► QueryClientProvider (TanStack Query)
│
└─► HomePage (page.tsx)
    │
    ├─► Header Section (JSX)
    │   ├─► Search Icon
    │   ├─► Title
    │   └─► Description
    │
    ├─► QueryForm (QueryForm.tsx)
    │   ├─► Form (React Hook Form)
    │   ├─► Textarea (query input)
    │   ├─► Validation Error Display
    │   └─► Submit Button
    │
    ├─► Loading State (conditional)
    │   └─► Animated Spinner
    │
    ├─► Error State (conditional)
    │   └─► Error Message Display
    │
    ├─► ResultsTable (ResultsTable.tsx) (conditional)
    │   ├─► Results Header
    │   │   └─► Export CSV Button
    │   └─► Dynamic Table
    │       ├─► Headers (from query vars)
    │       └─► Rows (from bindings)
    │
    └─► Footer (JSX)
```

---

## 3. Data Flow Sequence

```
User Action                React State              TanStack Query           API
────────────               ───────────              ──────────────           ───

1. User types query
   │
   ▼
2. Input captured
   by React Hook Form
   │
   ▼
3. User clicks "Run"
   │
   ▼
4. validateSparql()
   │
   ├─► Invalid
   │   └─► Show error
   │
   └─► Valid
       │
       ▼
5. onSubmit(query)
   │
   ▼
6. setQuery(query)        
   setShouldFetch(true)
   │                         │
   │                         ▼
   │                    Query enabled
   │                    condition met
   │                         │
   │                         ▼
   │                    Check cache
   │                         │
   │                         ├─► Cached
   │                         │   └─► Return immediately
   │                         │
   │                         └─► Not cached
   │                             │
   │                             ▼
   │                         queryFn()
   │                             │
   │                             ▼
   │                       fetchSparql(query)
   │                                           │
   │                                           ▼
   │                                       Encode query
   │                                           │
   │                                           ▼
   │                                    HTTP GET to
   │                                    DBpedia
   │                                           │
   │                                           ▼
   │                                    DBpedia processes
   │                                           │
   │                                           ▼
   │                                    JSON response
   │                             │
   │                             ▼
   │                    Parse response
   │                    Update cache
   │                         │
   ▼                         ▼
7. ResultsTable renders with data
   │
   ▼
8. User sees results
```

---

## 4. State Management Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Application State                      │
└─────────────────────────────────────────────────────────┘
                          │
                          │
        ┌─────────────────┴─────────────────┐
        │                                    │
        ▼                                    ▼
┌──────────────────┐              ┌──────────────────┐
│   Local State    │              │   Server State   │
│   (useState)     │              │ (TanStack Query) │
└──────────────────┘              └──────────────────┘
        │                                    │
        │                                    │
        ▼                                    ▼
┌──────────────────┐              ┌──────────────────┐
│ - query text     │              │ - API response   │
│ - shouldFetch    │              │ - isLoading      │
│ - form state     │              │ - error          │
│ - validation err │              │ - cached data    │
└──────────────────┘              └──────────────────┘
        │                                    │
        │                                    │
        ▼                                    ▼
   Quick updates                    Optimized for
   Simple UI logic                  async operations
   No persistence                   Auto-caching
```

---

## 5. File Structure & Responsibilities

```
sparql-query-app/
│
├── app/
│   │
│   ├── components/           [UI Components]
│   │   │
│   │   ├── QueryForm.tsx
│   │   │   ├── Renders: Textarea, Button
│   │   │   ├── Handles: Form submission
│   │   │   ├── Validates: SPARQL syntax
│   │   │   └── Emits: onSubmit event
│   │   │
│   │   └── ResultsTable.tsx
│   │       ├── Receives: SPARQL results
│   │       ├── Renders: Dynamic table
│   │       ├── Formats: URIs as links
│   │       └── Exports: CSV download
│   │
│   ├── lib/                  [Business Logic]
│   │   │
│   │   ├── fetchSparql.ts
│   │   │   ├── Purpose: API client
│   │   │   ├── Input: SPARQL query string
│   │   │   ├── Process: URL encode, HTTP GET
│   │   │   └── Output: Parsed JSON
│   │   │
│   │   └── validateSparql.ts
│   │       ├── Purpose: Syntax validation
│   │       ├── Checks: Keywords, braces, patterns
│   │       └── Returns: {isValid, error?}
│   │
│   ├── page.tsx              [Main Page]
│   │   ├── Orchestrates: All components
│   │   ├── Manages: Query state
│   │   └── Uses: TanStack Query
│   │
│   ├── layout.tsx            [Root Layout]
│   │   ├── Wraps: All pages
│   │   └── Provides: Metadata
│   │
│   ├── providers.tsx         [Context Providers]
│   │   └── Sets up: QueryClient
│   │
│   └── globals.css           [Global Styles]
│       └── Contains: Tailwind config
│
└── package.json              [Dependencies]
    ├── Next.js 16
    ├── React 19.2
    ├── TypeScript 5.x
    ├── TanStack Query 5.90
    ├── React Hook Form 7.66
    └── Tailwind CSS 4.x
```

---

## 6. TanStack Query Workflow

```
┌──────────────────────────────────────────────────────────┐
│                  useQuery Hook                            │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Query Configuration             │
        │  ────────────────────            │
        │  • queryKey: ["sparql", query]  │
        │  • queryFn: () => fetchSparql() │
        │  • enabled: shouldFetch         │
        └─────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────┐
              │  Enabled Check    │
              └───────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
         ┌───────────┐      ┌──────────────┐
         │  FALSE    │      │    TRUE      │
         │  Skip     │      │  Continue    │
         └───────────┘      └──────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  Cache Lookup   │
                         └─────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
            ┌───────────────┐           ┌─────────────────┐
            │  Cache HIT    │           │  Cache MISS     │
            │  Return data  │           │  Execute query  │
            └───────────────┘           └─────────────────┘
                    │                             │
                    │                             ▼
                    │                   ┌──────────────────┐
                    │                   │  queryFn()       │
                    │                   │  fetchSparql()   │
                    │                   └──────────────────┘
                    │                             │
                    │                             ▼
                    │                   ┌──────────────────┐
                    │                   │  Success/Error   │
                    │                   └──────────────────┘
                    │                             │
                    │                             ▼
                    │                   ┌──────────────────┐
                    │                   │  Update Cache    │
                    │                   └──────────────────┘
                    │                             │
                    └─────────────────────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │  Return Result  │
                         │  {data, error,  │
                         │   isLoading}    │
                         └─────────────────┘
```

---

## 7. Form Validation Flow

```
User Input                   Validation                  Outcome
──────────                   ──────────                  ───────

Query entered
     │
     ▼
Submit clicked
     │
     ▼
React Hook Form
validation
     │
     ├─► Empty?
     │   └─► Show "Required" error  ───► STOP
     │
     ▼
validateSparql()
     │
     ├─► Empty/whitespace?
     │   └─► Show "Cannot be empty"  ──► STOP
     │
     ├─► No SELECT/CONSTRUCT/ASK/DESCRIBE?
     │   └─► Show "Invalid query type" ► STOP
     │
     ├─► Missing WHERE clause?
     │   └─► Show "Must include WHERE" ► STOP
     │
     ├─► Unbalanced braces?
     │   └─► Show "Unbalanced braces" ► STOP
     │
     ├─► Unbalanced parentheses?
     │   └─► Show "Unbalanced parens" ► STOP
     │
     ├─► SELECT without vars?
     │   └─► Show "Specify variables" ► STOP
     │
     └─► No triple pattern?
         └─► Show "Need triple pattern" ► STOP

All checks pass
     │
     ▼
Clear errors
     │
     ▼
Call onSubmit(query)
     │
     ▼
Execute query
```

---

## 8. Error Handling Strategy

```
┌────────────────────────────────────────────────┐
│          Multi-Layer Error Handling             │
└────────────────────────────────────────────────┘

Layer 1: Form Level
────────────────────
  • React Hook Form validation
  • Checks: Required fields
  • UI: Inline error message
  
      │
      ▼
      
Layer 2: Validation Level
────────────────────────
  • Custom validateSparql()
  • Checks: SPARQL syntax
  • UI: Highlighted error box
  
      │
      ▼
      
Layer 3: Network Level
─────────────────────
  • TanStack Query error state
  • Catches: fetch() failures, 4xx/5xx
  • UI: Error banner
  
      │
      ▼
      
Layer 4: Display Level
─────────────────────
  • Empty results check
  • Handles: Valid query, no results
  • UI: "No results found" message

Each layer provides specific, actionable feedback
```

---

## 9. Component Props Flow

```
HomePage
  │
  │ State: query, shouldFetch
  │ Hooks: useQuery
  │
  ├─► QueryForm
  │   │
  │   │ Props IN:
  │   │   └─► onSubmit: (query: string) => void
  │   │
  │   │ Internal:
  │   │   ├─► useForm hook
  │   │   ├─► Local validation state
  │   │   └─► validateSparql function
  │   │
  │   │ Events OUT:
  │   │   └─► Calls onSubmit with valid query
  │
  └─► ResultsTable
      │
      │ Props IN:
      │   └─► data: {
      │         head: { vars: string[] },
      │         results: { bindings: [] }
      │       }
      │
      │ Renders:
      │   ├─► Dynamic table headers (from vars)
      │   ├─► Dynamic rows (from bindings)
      │   ├─► URI detection & linking
      │   └─► CSV export button

Props flow DOWN (parent to children)
Events flow UP (children to parent via callbacks)
```

---

## 10. Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│  ┌───────────────────────────────────────┐  │
│  │  React Components (JSX)               │  │
│  │  • QueryForm, ResultsTable, HomePage  │  │
│  └───────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│               Styling Layer                  │
│  ┌───────────────────────────────────────┐  │
│  │  Tailwind CSS                         │  │
│  │  • Utility classes                    │  │
│  │  • Custom components (@layer)         │  │
│  │  • Responsive design                  │  │
│  └───────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│           State Management Layer             │
│  ┌────────────────┐  ┌──────────────────┐  │
│  │  Local State   │  │  Server State    │  │
│  │  (useState,    │  │  (TanStack       │  │
│  │  useForm)      │  │   Query)         │  │
│  └────────────────┘  └──────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│            Business Logic Layer              │
│  ┌───────────────────────────────────────┐  │
│  │  Utility Functions                    │  │
│  │  • validateSparql                     │  │
│  │  • fetchSparql                        │  │
│  └───────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│            Framework Layer                   │
│  ┌───────────────────────────────────────┐  │
│  │  Next.js                              │  │
│  │  • App Router                         │  │
│  │  • Build optimization                 │  │
│  │  • Development server                 │  │
│  └───────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│            Type Safety Layer                 │
│  ┌───────────────────────────────────────┐  │
│  │  TypeScript                           │  │
│  │  • Compile-time type checking         │  │
│  │  • Interface definitions              │  │
│  │  • IDE support                        │  │
│  └───────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## How to Use These Diagrams

### In the Interview:

1. **Start with High-Level** (Diagram #1)
   - "Let me show you the overall architecture..."
   - Draw on whiteboard or show on screen

2. **Dive into Components** (Diagram #2)
   - "Here's how the components are organized..."
   - Explain parent-child relationships

3. **Explain Data Flow** (Diagram #3)
   - "When a user submits a query, here's what happens..."
   - Walk through step by step

4. **Discuss State** (Diagram #4)
   - "We use a two-tier state management approach..."
   - Explain why we separated concerns

5. **Show Code Organization** (Diagram #5)
   - "The file structure follows clear separation of concerns..."
   - Mention testability and maintainability

### Practice Tips:

- [ ] Draw each diagram from memory on paper
- [ ] Explain each diagram out loud
- [ ] Practice transitioning between diagrams
- [ ] Prepare answers for questions at each level
- [ ] Time yourself - aim for 2-3 min per diagram

---

## Key Points to Emphasize

1. **Clean Architecture**: Separation of concerns at every level
2. **Unidirectional Flow**: Data flows down, events flow up
3. **Type Safety**: TypeScript throughout
4. **Caching Strategy**: TanStack Query handles it automatically
5. **Error Handling**: Multiple layers with specific feedback
6. **User Experience**: Loading states, validation, export

---

**Remember**: These diagrams are tools to help YOU explain YOUR understanding. Use them as references, but make the explanation your own!

Good luck! 🚀
