// Set environment to development
process.env.NODE_ENV = 'development';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config({ silent: true });

import chalk from 'chalk';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import detect from 'detect-port';
import inquirer from 'inquirer';
import open from 'open';
import paths from '../config/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useYarn = fs.existsSync(paths.yarnLockFile);
const cli = useYarn ? 'yarn' : 'npm';
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!fs.existsSync(paths.appHtml) || !fs.existsSync(paths.appIndexJs)) {
  console.error('Required files are missing. Exiting.');
  process.exit(1);
}

const DEFAULT_PORT = process.env.PORT || 3000;

async function start() {
  try {
    const port = await detect(DEFAULT_PORT);
    if (port !== DEFAULT_PORT) {
      if (isInteractive) {
        const question = {
          type: 'confirm',
          name: 'shouldChangePort',
          message: chalk.yellow(`Something is already running on port ${DEFAULT_PORT}. Change to port ${port}?`),
          default: true,
        };
        const answer = await inquirer.prompt(question);
        if (!answer.shouldChangePort) {
          process.exit(0);
        }
      } else {
        console.log(chalk.red(`Something is already running on port ${DEFAULT_PORT}.`));
        process.exit(1);
      }
    }

    const server = await createServer({
      configFile: path.resolve(__dirname, '../vite.config.js'),
      server: {
        port,
        open: false,
      },
    });

    await server.listen();

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const packageJson = JSON.parse(fs.readFileSync(paths.appPackageJson, 'utf8'));
    const appName = packageJson.name;
    const urls = {
      localUrlForTerminal: `${protocol}://localhost:${port}`,
      localUrlForBrowser: `${protocol}://localhost:${port}`,
    };

    // console.clear(); // Alternative to clearConsole
    console.log(chalk.cyan('Starting the development server...\n'));
    console.log(`You can now view ${chalk.bold(appName)} in the browser.\n`);
    console.log(`  ${chalk.bold('Local:')}            ${urls.localUrlForBrowser}`);
    console.log(`  ${chalk.bold('On Your Network:')}  ${urls.localUrlForTerminal}\n`);

    // open(urls.localUrlForBrowser); // Alternative to openBrowser
  } catch (err) {
    console.log(chalk.red('Failed to start development server.\n'));
    console.error(err);
    process.exit(1);
  }
}

start();
