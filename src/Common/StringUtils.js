export function isNumeric(str) {
  if (typeof str !== "string") return false; // we only process strings!
  return !isNaN(str) &&           // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function isLowerCase(str)
{
  // Important to check upper to ensure its not a punctuation or number
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

export function isUpperCase(str)
{
  // Important to check lower to ensure its not a punctuation or number
  return str !== str.toLowerCase() && str === str.toUpperCase();
}

export function isSymbol(char) {
  return '^$*.[]{}()?"!@#%&/\\,><\':;|_~`'.includes(char);
}
