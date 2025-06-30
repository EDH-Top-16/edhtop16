import ts from "typescript";

function loadProgram() {
  const configFile = ts.findConfigFile(
    process.cwd(),
    ts.sys.fileExists,
    "tsconfig.json",
  );

  if (!configFile) throw Error("tsconfig.json not found");
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    process.cwd(),
  );

  return ts.createProgram({
    options,
    rootNames: fileNames,
    configFileParsingDiagnostics: errors,
  });
}

type RiverResource = {
  resourceName: string;
  sourceFile: ts.SourceFile;
  symbol: ts.Symbol;
};

type RiverRoute = {
  routeName: string;
  sourceFile: ts.SourceFile;
  symbol: ts.Symbol;
};

function collectRiverNodes(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  riverResources: RiverResource[],
  riverRoutes: RiverRoute[],
) {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (moduleSymbol == null) return;

  const exports = checker.getExportsOfModule(moduleSymbol);
  for (const symbol of exports) {
    const tags = symbol.getJsDocTags();
    for (const tag of tags) {
      const tagText = tag.text?.at(0)?.text;
      if (tagText == null) {
        throw new Error(
          `River directive "${tag.name}" requires at least one argument`,
        );
      }

      switch (tag.name) {
        case "route": {
          riverRoutes.push({ routeName: tagText, sourceFile, symbol });
          break;
        }
        case "resource": {
          riverResources.push({ resourceName: tagText, sourceFile, symbol });
          break;
        }
      }
    }
  }
}

function shouldVisitSourceFile(sourceFile: ts.SourceFile) {
  return (
    !sourceFile.fileName.includes("node_modules") &&
    !sourceFile.isDeclarationFile
  );
}

const program = loadProgram();
const checker = program.getTypeChecker();

const riverResources: RiverResource[] = [];
const riverRoutes: RiverRoute[] = [];
program
  .getSourceFiles()
  .filter(shouldVisitSourceFile)
  .forEach((f) => collectRiverNodes(checker, f, riverResources, riverRoutes));

for (const { resourceName, sourceFile, symbol } of riverResources) {
  console.log(
    "Found resource",
    resourceName,
    "in module",
    sourceFile.fileName,
    "exported as",
    symbol.name,
  );
}

for (const { routeName, sourceFile, symbol } of riverRoutes) {
  console.log(
    "Found route",
    routeName,
    "in module",
    sourceFile.fileName,
    "exported as",
    symbol.name,
  );
}
