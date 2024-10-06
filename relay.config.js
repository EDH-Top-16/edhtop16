module.exports = {
  src: "./src",
  schema: "src/queries/schema.graphql",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  language: "typescript",
  artifactDirectory: "src/queries/__generated__",
};
