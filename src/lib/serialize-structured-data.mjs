/**
 * Serialize JSON-LD without allowing an HTML parser to terminate the script element early.
 * JSON accepts the Unicode escape and reconstructs the original value when parsed.
 *
 * @param {unknown} data
 * @returns {string}
 */
export function serializeStructuredData(data) {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
