# 📚 Example SPARQL Queries for Interview Demo

This document contains working SPARQL queries you can use to demonstrate the application during your interview.

---

## Basic Queries (Start with These)

### 1. Simple Query - 10 Random Things
**Purpose**: Shows basic SELECT and LIMIT functionality
```sparql
SELECT ?subject ?predicate ?object WHERE {
  ?subject ?predicate ?object .
} LIMIT 10
```
**What it does**: Retrieves 10 random triples from DBpedia

---

### 2. Programming Languages
**Purpose**: Demonstrates filtering and labels
```sparql
SELECT ?language ?name
WHERE {
  ?language rdf:type dbo:ProgrammingLanguage .
  ?language rdfs:label ?name .
  FILTER (LANG(?name) = 'en')
}
LIMIT 10
```
**What it does**: Lists 10 programming languages with English names

**Interview Point**: "Notice how we filter by type (dbo:ProgrammingLanguage) and language (FILTER LANG = 'en') to get meaningful results"

---

## Intermediate Queries

### 3. Actors in Inception
**Purpose**: Shows relational queries
```sparql
SELECT ?actor ?name WHERE {
  dbr:Inception dbo:starring ?actor .
  ?actor rdfs:label ?name .
  FILTER (lang(?name) = 'en')
}
LIMIT 20
```
**What it does**: Finds all actors in the movie Inception

**Interview Point**: "This demonstrates querying relationships between entities - movies and their actors"

---

### 4. Cities with Population
**Purpose**: Shows filtering by numeric values and ordering
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
LIMIT 15
```
**What it does**: Lists 15 largest cities with population over 1 million

**Interview Point**: "Here we use numeric filtering (population > 1M) and sorting (ORDER BY DESC) to get meaningful results"

---

### 5. Musicians and Birth Dates
**Purpose**: Demonstrates date handling
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
**What it does**: Lists 15 most recently born musicians

---

## Advanced Queries

### 6. Books by Author Count
**Purpose**: Shows aggregation (COUNT)
```sparql
SELECT ?author ?authorName (COUNT(?book) as ?bookCount)
WHERE {
  ?book rdf:type dbo:Book .
  ?book dbo:author ?author .
  ?author rdfs:label ?authorName .
  FILTER (LANG(?authorName) = 'en')
}
GROUP BY ?author ?authorName
ORDER BY DESC(?bookCount)
LIMIT 10
```
**What it does**: Lists top 10 most prolific authors in DBpedia

**Interview Point**: "This uses GROUP BY and COUNT for aggregation, similar to SQL"

---

### 7. Countries and Capitals
**Purpose**: Demonstrates multiple predicates
```sparql
SELECT ?country ?countryName ?capital ?capitalName
WHERE {
  ?country rdf:type dbo:Country .
  ?country rdfs:label ?countryName .
  ?country dbo:capital ?capital .
  ?capital rdfs:label ?capitalName .
  FILTER (LANG(?countryName) = 'en')
  FILTER (LANG(?capitalName) = 'en')
}
LIMIT 20
```
**What it does**: Lists countries with their capitals

---

### 8. Software with Latest Version
**Purpose**: Shows OPTIONAL clauses
```sparql
SELECT ?software ?name ?version ?releaseDate
WHERE {
  ?software rdf:type dbo:Software .
  ?software rdfs:label ?name .
  OPTIONAL { ?software dbo:latestReleaseVersion ?version }
  OPTIONAL { ?software dbo:latestReleaseDate ?releaseDate }
  FILTER (LANG(?name) = 'en')
}
LIMIT 15
```
**What it does**: Lists software with optional version info

**Interview Point**: "OPTIONAL keyword allows fetching data that might not exist for all entities, similar to LEFT JOIN in SQL"

---

## Edge Cases to Demonstrate

### 9. Empty Result (Intentional)
**Purpose**: Shows empty result handling
```sparql
SELECT ?subject ?name WHERE {
  ?subject rdf:type dbo:AlienSpecies .
  ?subject rdfs:label ?name .
  FILTER (LANG(?name) = 'en')
}
LIMIT 10
```
**What it does**: Likely returns no results (or very few)

**Interview Point**: "Our app gracefully handles empty results with a helpful message"

---

### 10. Query with Error (For Validation Demo)
**Purpose**: Shows validation working
```sparql
SELECT * WHERE
```
**What happens**: Validation catches missing braces and triple pattern

**Interview Point**: "Our validation catches syntax errors before sending to the server, providing instant feedback"

---

## Queries Grouped by Demonstration Purpose

### Show Loading State
Use Query #4 (Cities with Population) - typically takes 1-2 seconds

### Show URI Links
Use Query #3 (Actors) - results include DBpedia URIs that become clickable links

### Show CSV Export
Use Query #2 (Programming Languages) - simple data perfect for export

### Show Dynamic Columns
Compare Query #1 (3 columns) vs Query #2 (2 columns) - table adjusts automatically

### Show Error Handling
Try querying with no internet or use malformed query

---

## Interview Demonstration Script

**Opening** (1 minute):
1. Explain what SPARQL is
2. Mention DBpedia as the data source
3. Show the clean UI

**Basic Demo** (2 minutes):
1. Use Query #1 to show basic functionality
2. Point out: validation, loading state, results table
3. Export to CSV

**Technical Demo** (3 minutes):
1. Use Query #4 to show filtering and sorting
2. Explain how dynamic columns work
3. Show URI links are clickable
4. Use intentionally bad query to show validation

**Architecture Discussion** (4 minutes):
1. Explain data flow from form to results
2. Discuss TanStack Query caching
3. Show how state management works
4. Mention TypeScript type safety

---

## Quick Tips for Demo

### Do's:
✅ Start with simple queries (Query #1 or #2)
✅ Explain what each query does before running it
✅ Point out loading states and error handling
✅ Show the CSV export feature
✅ Demonstrate validation with malformed query
✅ Explain how the table adapts to different queries

### Don'ts:
❌ Don't use queries that might time out (very complex)
❌ Don't skip explaining SPARQL if interviewer is unfamiliar
❌ Don't forget to mention the tech stack
❌ Don't just click through - explain as you go

---

## Common SPARQL Prefixes (Good to Know)

```sparql
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
```

**Note**: DBpedia endpoint has these prefixes pre-configured, so you don't need to include them in queries.

---

## SPARQL Concepts to Explain

### Triple Pattern
**Format**: `?subject ?predicate ?object`
**Example**: `?person foaf:name ?name`
**Explanation**: "SPARQL queries are based on triple patterns. Each line in the WHERE clause is a pattern we're matching against the RDF graph."

### Filter
**Example**: `FILTER (LANG(?name) = 'en')`
**Explanation**: "Filters restrict results based on conditions, similar to WHERE clauses in SQL."

### LIMIT
**Example**: `LIMIT 10`
**Explanation**: "Limits the number of results returned, crucial for performance when querying large datasets like DBpedia."

### ORDER BY
**Example**: `ORDER BY DESC(?population)`
**Explanation**: "Sorts results, just like SQL. DESC for descending, ASC for ascending (default)."

### OPTIONAL
**Example**: `OPTIONAL { ?software dbo:version ?version }`
**Explanation**: "Like LEFT JOIN in SQL - includes results even if the optional part doesn't match."

---

## Troubleshooting During Demo

### If Query Times Out:
- Mention: "DBpedia is a public endpoint and can be slow. In production, we'd implement caching."
- Have a backup query ready

### If No Results:
- Explain: "This demonstrates our empty state handling."
- Try a different query

### If Validation Fails:
- Good opportunity to show validation feature!
- Explain what's wrong and fix it

### If Internet Issues:
- Show the error handling
- Explain how you'd add retry logic

---

## Key Points to Emphasize

1. **Type Safety**: "Notice how TypeScript ensures we handle all result formats correctly"
2. **User Experience**: "Loading states, error messages, and validation provide great UX"
3. **Performance**: "TanStack Query caches results, so re-running the same query is instant"
4. **Flexibility**: "The table dynamically adjusts to any query structure"
5. **Export**: "Users can export results for analysis in Excel or other tools"
6. **Validation**: "Client-side validation prevents invalid queries before they hit the server"

---

## Practice Checklist

Before your interview, practice:
- [ ] Running all queries successfully
- [ ] Explaining what each query does
- [ ] Demonstrating the CSV export
- [ ] Showing the validation error messages
- [ ] Explaining the tech stack while demo-ing
- [ ] Drawing the architecture diagram
- [ ] Describing the data flow

---

**Remember**: You're not just showing an app, you're demonstrating:
- Problem-solving skills
- Technical knowledge
- User experience awareness
- Code quality standards
- Communication ability

**Good luck! You've got this! 🚀**
