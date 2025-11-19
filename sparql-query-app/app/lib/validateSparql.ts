/**
 * Validates a SPARQL query for basic syntax correctness
 * @param query - The SPARQL query string to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export function validateSparql(query: string): {
  isValid: boolean;
  error?: string;
} {
  // Check if query is empty or only whitespace
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: "Query cannot be empty" };
  }

  const trimmedQuery = query.trim().toUpperCase();

  // Check for valid SPARQL query type
  const validQueryTypes = ["SELECT", "CONSTRUCT", "ASK", "DESCRIBE"];
  const hasValidQueryType = validQueryTypes.some(
    (type) =>
      trimmedQuery.startsWith(type) ||
      (trimmedQuery.includes(`PREFIX`) && trimmedQuery.includes(type))
  );

  if (!hasValidQueryType) {
    return {
      isValid: false,
      error:
        "Query must start with SELECT, CONSTRUCT, ASK, or DESCRIBE (or include PREFIX declarations)",
    };
  }

  // Check for WHERE clause (required for most queries except ASK without WHERE)
  const hasWhere = trimmedQuery.includes("WHERE");
  const isAskQuery = trimmedQuery.includes("ASK");

  if (!hasWhere && !isAskQuery) {
    return {
      isValid: false,
      error: "Query must include a WHERE clause",
    };
  }

  // Check for balanced braces
  const openBraces = (query.match(/{/g) || []).length;
  const closeBraces = (query.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    return {
      isValid: false,
      error: `Unbalanced braces: ${openBraces} opening brace(s) but ${closeBraces} closing brace(s)`,
    };
  }

  if (openBraces === 0) {
    return {
      isValid: false,
      error: "Query must include at least one graph pattern with braces { }",
    };
  }

  // Check for balanced parentheses
  const openParens = (query.match(/\(/g) || []).length;
  const closeParens = (query.match(/\)/g) || []).length;

  if (openParens !== closeParens) {
    return {
      isValid: false,
      error: `Unbalanced parentheses: ${openParens} opening but ${closeParens} closing`,
    };
  }

  // Check for SELECT with variables
  if (trimmedQuery.includes("SELECT") && !trimmedQuery.includes("SELECT *")) {
    // Check if there are variables after SELECT
    const selectMatch = query.match(/SELECT\s+(.+?)\s+WHERE/i);
    if (selectMatch) {
      const selectClause = selectMatch[1].trim();
      // Variables should start with ? or $
      if (!selectClause.match(/[\?$]\w+/) && !selectClause.includes("*")) {
        return {
          isValid: false,
          error:
            "SELECT query must specify variables (e.g., ?var) or use SELECT *",
        };
      }
    }
  }

  // Check for at least one triple pattern (subject predicate object)
  const triplePatternRegex = /[\?$]\w+\s+[\?$\w:<>]+\s+[\?$\w:<>"']/;
  if (!triplePatternRegex.test(query) && !trimmedQuery.includes("SELECT *")) {
    return {
      isValid: false,
      error:
        "Query should contain at least one valid triple pattern (subject predicate object)",
    };
  }

  // All checks passed
  return { isValid: true };
}
