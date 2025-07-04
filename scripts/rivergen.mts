import { readFile } from "node:fs/promises";
import { Project, SourceFile, Symbol, SyntaxKind, ts } from "ts-morph";
import path from "node:path";
import pc from "picocolors";

const JS_RESOURCE_FILENAME = "__generated__/river/js_resource.ts";
const JS_RESOURCE_TEMPLATE = "scripts/templates/js_resource.ts";
const ROUTER_FILENAME = "__generated__/river/router.tsx";
const ROUTER_TEMPLATE = "scripts/templates/router.tsx";
const SERVER_ROUTER_FILENAME = "__generated__/river/server_router.ts";
const SERVER_ROUTER_TEMPLATE = "scripts/templates/server_router.ts";

async function loadRiverFiles(project: Project) {
  async function loadSourceFile(fileName: string, templateFileName: string) {
    const template = await readFile(templateFileName, "utf-8");
    return project.createSourceFile(fileName, template, {
      overwrite: true,
    });
  }

  const [jsResource, router, serverRouter] = await Promise.all([
    loadSourceFile(JS_RESOURCE_FILENAME, JS_RESOURCE_TEMPLATE),
    loadSourceFile(ROUTER_FILENAME, ROUTER_TEMPLATE),
    loadSourceFile(SERVER_ROUTER_FILENAME, SERVER_ROUTER_TEMPLATE),
  ]);

  return { jsResource, router, serverRouter } as const;
}

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

function collectRiverNodes(project: Project) {
  const resources: RiverResource[] = [];
  const routes: RiverRoute[] = [];

  function visitRiverNodes(sourceFile: SourceFile) {
    sourceFile.getExportSymbols().forEach((symbol) => {
      for (const tag of symbol.getJsDocTags()) {
        switch (tag.getName()) {
          case "route": {
            routes.push({
              routeName: tag.getText().at(0)?.text!,
              sourceFile,
              symbol,
            });
            break;
          }
          case "resource": {
            resources.push({
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

  project.getSourceFiles().forEach(visitRiverNodes);
  return { resources, routes } as const;
}

async function main() {
  const project = new Project({ tsConfigFilePath: "tsconfig.json" });
  const riverFiles = await loadRiverFiles(project);
  const riverNodes = collectRiverNodes(project);

  const resourceConf = riverFiles.jsResource
    .getVariableDeclarationOrThrow("RESOURCE_CONF")
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  resourceConf.getPropertyOrThrow("noop").remove();
  for (const { resourceName, sourceFile, symbol } of riverNodes.resources) {
    const filePath = path.relative(process.cwd(), sourceFile.getFilePath());
    const moduleSpecifier =
      riverFiles.jsResource.getRelativePathAsModuleSpecifierTo(
        sourceFile.getFilePath(),
      );

    resourceConf.addPropertyAssignment({
      name: `"${resourceName}"`,
      initializer: (writer) => {
        writer.block(() => {
          writer
            .writeLine(`src: "${filePath}",`)
            .writeLine(
              `loader: () => import("${moduleSpecifier}").then(m => m.${symbol.getName()})`,
            );
        });
      },
    });

    console.log(
      "Created resource",
      pc.cyan(resourceName),
      "for",
      pc.green(symbol.getName()),
      "exported from",
      pc.yellow(filePath),
    );
  }

  const routerConf = riverFiles.router
    .getVariableDeclarationOrThrow("ROUTER_CONF")
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  let entryPointImportIndex = 0;
  for (const { routeName, sourceFile, symbol } of riverNodes.routes) {
    const importAlias = `e${entryPointImportIndex++}`;
    const filePath = path.relative(process.cwd(), sourceFile.getFilePath());
    const moduleSpecifier =
      riverFiles.router.getRelativePathAsModuleSpecifierTo(
        sourceFile.getFilePath(),
      );

    riverFiles.router.addImportDeclaration({
      moduleSpecifier,
      namedImports: [
        {
          name: symbol.getName(),
          alias: importAlias,
        },
      ],
    });

    routerConf.addPropertyAssignment({
      name: `"${routeName}"`,
      initializer: (writer) => {
        writer.write(`{ entrypoint: ${importAlias} } as const`);
      },
    });

    console.log(
      "Created route",
      pc.cyan(routeName),
      "for",
      pc.green(symbol.getName()),
      "exported from",
      pc.yellow(filePath),
    );
  }

  await Promise.all([
    riverFiles.jsResource.save(),
    riverFiles.router.save(),
    riverFiles.serverRouter.save(),
  ]);
}

main().catch(console.error);
