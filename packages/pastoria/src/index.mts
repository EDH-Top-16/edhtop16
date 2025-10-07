#!/usr/bin/env node --experimental-strip-types

import {program} from 'commander';
import packageData from '../package.json' with {type: 'json'};
import {generatePastoriaArtifacts} from './generate.mts';
import {startDevserver} from './devserver.mts';
import {createBuild} from './build.mts';

program
  .name('pastoria')
  .description(packageData.description)
  .version(packageData.version);

program
  .command('gen')
  .description('Run Pastoria code generation')
  .action(generatePastoriaArtifacts);

program
  .command('dev')
  .description('Start the pastoria devserver')
  .option('--port <port>', 'Port the devserver will listen on', '3000')
  .action(startDevserver);

program
  .command('build')
  .description('Creates a production build of the project')
  .action(createBuild);

program.parseAsync();
