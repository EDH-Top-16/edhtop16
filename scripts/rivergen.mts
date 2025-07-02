import { Project, SourceFile, Symbol } from "ts-morph";

const JS_RESOURCE_FILENAME = "__generated__/river/js_resource.ts";
const ROUTER_FILENAME = "__generated__/river/router.ts";
const SERVER_ROUTER_FILENAME = "__generated__/river/server_router.ts";

type RiverResource = {
  resourceName: string;
  sourceFile: SourceFile;
  symbol: Symbol;
};

type RiverRoute = {
  routeName: string;
  sourceFile: SourceFile;
  symbol: Symbol;
};

function collectRiverNodes(
  sourceFile: SourceFile,
  riverResources: RiverResource[],
  riverRoutes: RiverRoute[],
) {
  console.log("searching", sourceFile.getFilePath());
  sourceFile.getExportSymbols().forEach((symbol) => {
    for (const tag of symbol.getJsDocTags()) {
      switch (tag.getName()) {
        case "route": {
          riverRoutes.push({
            routeName: tag.getText().at(0)?.text!,
            sourceFile,
            symbol,
          });
          break;
        }
        case "resource": {
          riverResources.push({
            resourceName: tag.getText().at(0)?.text!,
            sourceFile,
            symbol,
          });
          break;
        }
      }
    }
  });
}

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const riverFiles = {
  jsResource: project.createSourceFile(JS_RESOURCE_FILENAME, "", {
    overwrite: true,
  }),
  router: project.createSourceFile(ROUTER_FILENAME, "", {
    overwrite: true,
  }),
  serverRouter: project.createSourceFile(SERVER_ROUTER_FILENAME, "", {
    overwrite: true,
  }),
} as const;

const riverResources: RiverResource[] = [];
const riverRoutes: RiverRoute[] = [];
project
  .getSourceFiles()
  .forEach((f) => collectRiverNodes(f, riverResources, riverRoutes));

for (const { resourceName, sourceFile, symbol } of riverResources) {
  console.log(
    "Found resource",
    resourceName,
    "in module",
    riverFiles.jsResource.getRelativePathAsModuleSpecifierTo(
      sourceFile.getFilePath(),
    ),
    "exported as",
    symbol.getName(),
  );
}

for (const { routeName, sourceFile, symbol } of riverRoutes) {
  console.log(
    "Found route",
    routeName,
    "in module",
    riverFiles.router.getRelativePathAsModuleSpecifierTo(
      sourceFile.getFilePath(),
    ),
    "exported as",
    symbol.getName(),
  );
}
