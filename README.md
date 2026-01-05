# 🔍 SPARQL Query Explorer

A modern, interactive web application for exploring and querying RDF data using SPARQL. Built with Next.js 16, TypeScript, and TanStack Query (React Query), this app provides a clean interface to execute SPARQL queries against DBpedia and visualize results in a responsive table format.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwindcss)

### [Live Demo](https://sparql-next-js.vercel.app/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Example Queries](#-example-queries)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Interactive Query Editor**: Write and execute SPARQL queries with a user-friendly textarea interface
- **Real-time Results**: Instant query execution with loading states and error handling
- **Responsive Table View**: Clean, tabular display of query results with alternating row colors
- **DBpedia Integration**: Pre-configured to query the DBpedia SPARQL endpoint
- **Modern UI/UX**: Built with Tailwind CSS for a sleek, responsive design
- **Type-Safe**: Full TypeScript support for better development experience
- **Optimized Performance**: Leverages TanStack Query for efficient data fetching and caching
- **Form Validation**: Uses React Hook Form for robust form handling

---

## 🎯 Demo

1. Enter a SPARQL query in the text area
2. Click "Run Query" to execute
3. View results in an organized table format
4. Experience smooth loading states and error handling

---

## 🛠 Tech Stack

### Core Framework

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19.2](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### State Management & Data Fetching

- **[@tanstack/react-query](https://tanstack.com/query/latest)** - Async state management
- **[react-hook-form](https://react-hook-form.com/)** - Form validation and handling

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing

---

## 📁 Project Structure

```
sparql-query-app/
├── app/
│   ├── components/
│   │   ├── QueryForm.tsx        # SPARQL query input form
│   │   └── ResultsTable.tsx     # Results display table
│   ├── lib/
│   │   └── fetchSparql.ts       # SPARQL API client
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page component
│   └── providers.tsx            # React Query provider setup
├── public/                       # Static assets
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**: Package manager

### Installation

1. **Clone the repository** (or navigate to your project directory):

   ```bash
   cd sparql-query-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Install required peer dependencies** (if not already installed):
   ```bash
   npm install @tanstack/react-query react-hook-form
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm run start
```

This creates an optimized production build and starts the production server.

---

## 💻 Usage

### Basic Workflow

1. **Enter a SPARQL Query**: Type or paste your SPARQL query into the textarea
2. **Execute**: Click the "Run Query" button
3. **View Results**: Results appear in a formatted table below the form
4. **Iterate**: Modify your query and re-run as needed

### Query Interface

The query form accepts standard SPARQL 1.1 queries. Results are automatically parsed and displayed in a table format with:

- Column headers from query variables
- Row data from result bindings
- Clean styling with hover effects
- Responsive design for all screen sizes

---

## 📝 Example Queries

### 1. Get all actors in a movie

```sparql
SELECT ?actor ?name WHERE {
  dbr:Inception dbo:starring ?actor.
  ?actor rdfs:label ?name.
  FILTER (lang(?name) = 'en')
}
```

### 2. List 10 Programming Languages

```sparql
SELECT ?language ?name
WHERE {
  ?language rdf:type dbo:ProgrammingLanguage .
  ?language rdfs:label ?name .
  FILTER (LANG(?name) = 'en')
}
LIMIT 10
```

### 3. Find Cities with Population

```sparql
SELECT ?city ?name ?population
WHERE {
  ?city rdf:type dbo:City .
  ?city rdfs:label ?name .
  ?city dbo:populationTotal ?population .
  FILTER (LANG(?name) = 'en')
  FILTER (?population > 1000000)
}
ORDER BY DESC(?population)
LIMIT 20
```

### 4. List Musicians and Their Birth Dates

```sparql
SELECT ?musician ?name ?birthDate
WHERE {
  ?musician rdf:type dbo:MusicalArtist .
  ?musician rdfs:label ?name .
  ?musician dbo:birthDate ?birthDate .
  FILTER (LANG(?name) = 'en')
}
ORDER BY DESC(?birthDate)
LIMIT 15
```

---

## 🏗 Architecture

### Component Hierarchy

```
HomePage (page.tsx)
├── QueryForm (QueryForm.tsx)
│   └── React Hook Form integration
├── Loading Spinner (conditional)
├── Error Message (conditional)
└── ResultsTable (ResultsTable.tsx)
    └── Dynamic table rendering
```

### Data Flow

1. **User Input**: Query entered in `QueryForm`
2. **State Update**: Query state updated in `HomePage`
3. **Query Trigger**: TanStack Query enabled, triggers fetch
4. **API Call**: `fetchSparql` function makes HTTP request to DBpedia
5. **Response Handling**: Results parsed and passed to `ResultsTable`
6. **UI Update**: Table renders with formatted data

### Key Design Decisions

- **Client-side Rendering**: Uses `"use client"` for interactive components
- **Controlled Fetching**: Query execution triggered by user action, not automatic
- **Optimistic UI**: Loading and error states for better UX
- **Type Safety**: TypeScript interfaces ensure data integrity
- **Separation of Concerns**: Clear separation between UI, logic, and data fetching

---

## 🔌 API Reference

### `fetchSparql(query: string)`

Executes a SPARQL query against the DBpedia endpoint.

**Parameters:**

- `query` (string): SPARQL query string

**Returns:**

- Promise resolving to JSON response with `head` and `results` objects

**Example:**

```typescript
const data = await fetchSparql(`
  SELECT ?name WHERE {
    ?person rdfs:label "Albert Einstein"@en .
    ?person rdfs:label ?name .
  } LIMIT 5
`);
```

### SPARQL Endpoint

- **URL**: `https://dbpedia.org/sparql`
- **Format**: JSON
- **Documentation**: [DBpedia SPARQL](https://wiki.dbpedia.org/online-access/sparql-endpoint)

---

## 🎨 Customization

### Changing the SPARQL Endpoint

Edit `app/lib/fetchSparql.ts`:

```typescript
const endpoint = "https://your-sparql-endpoint.com/sparql";
```

### Styling

The app uses Tailwind CSS. Customize colors, spacing, and components in:

- `app/globals.css` - Global styles
- Component files - Inline Tailwind classes

### Adding Features

Consider adding:

- Query history
- Saved queries/favorites
- Multiple endpoint support
- Export results (CSV, JSON)
- Query syntax highlighting
- Auto-complete for SPARQL keywords

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[DBpedia](https://dbpedia.org/)** - For providing the SPARQL endpoint
- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework
- **[TanStack](https://tanstack.com/)** - For React Query
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue in the repository
- Check existing issues for solutions
- Refer to [Next.js Documentation](https://nextjs.org/docs)
- Visit [SPARQL 1.1 Specification](https://www.w3.org/TR/sparql11-query/)

---

**Happy Querying! 🚀**
