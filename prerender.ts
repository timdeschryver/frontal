import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { routes } from './src/app/app.module';

enableProdMode();

const ROUTES = routes.map(route => (route.path === '**' ? './' : route.path) as string);

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const DIST_FOLDER = join(process.cwd(), 'dist');
const BROWSER_FOLDER = join(DIST_FOLDER, 'app');

const index = readFileSync(join(BROWSER_FOLDER, 'index.html'), 'utf8');

let previousRender = Promise.resolve();

ROUTES.forEach(route => {
  const fullPath = join(BROWSER_FOLDER, route);

  if (!existsSync(fullPath)) {
    mkdirSync(fullPath);
  }

  previousRender = previousRender
    .then(_ =>
      renderModuleFactory(AppServerModuleNgFactory, {
        document: index,
        url: route,
        extraProviders: [provideModuleMap(LAZY_MODULE_MAP)],
      }),
    )
    .then(html => writeFileSync(join(fullPath, 'index.html'), html));
});
