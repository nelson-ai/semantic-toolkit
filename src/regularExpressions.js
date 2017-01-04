// Atom syntax highlighting breaks on long lines, so long regexes are banned from the main file
// See https://github.com/atom/atom/issues/1667
module.exports = {
  // As defined in https://www.ietf.org/rfc/rfc3987.txt page 8
  schemeRegex: /^[a-zA-Z][a-zA-Z0-9.+-]*$/,
  // As defined in https://www.w3.org/TR/xml-names11/#NT-NCName
  qualifiedNameRegex: /^[a-zA-Z_\u{000C0}-\u{000D6}\u{000D8}-\u{000F6}\u{000F8}-\u{002FF}\u{00370}-\u{0037D}\u{0037F}-\u{01FFF}\u{0200C}-\u{0200D}\u{02070}-\u{0218F}\u{02C00}-\u{02FEF}\u{03001}-\u{0D7FF}\u{0F900}-\u{0FDCF}\u{0FDF0}-\u{0FFFD}\u{10000}-\u{EFFFF}][a-zA-Z0-9\u{000C0}-\u{000D6}\u{000D8}-\u{000F6}\u{000F8}-\u{002FF}\u{00370}-\u{0037D}\u{0037F}-\u{01FFF}\u{0200C}-\u{0200D}\u{02070}-\u{0218F}\u{02C00}-\u{02FEF}\u{03001}-\u{0D7FF}\u{0F900}-\u{0FDCF}\u{0FDF0}-\u{0FFFD}\u{10000}-\u{EFFFF}\u{000300}-\u{00036F}\u{0203F}-\u{02040}\u{00B7}_.-]*$/u,
};
