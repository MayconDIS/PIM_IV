// Metro (empacotador do Expo) dentro do monorepo sistema/.
//
// 1. O app importa @nexti/shared/sm2, /gamificacao e /content, caminhos que o
//    pacote declara no campo "exports". No Expo 51 o Metro só lê esse campo
//    com unstable_enablePackageExports ligado.
// 2. O npm deixa o react-native 0.74.5 do app em apps/react-mobile/node_modules
//    e instala outra cópia (mais nova) dentro de node_modules/expo. Procurar
//    primeiro na pasta do app, sem subir pelas pastas de cada pacote, garante
//    que todo o código use a mesma cópia — a do Expo 51.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const pastaDoApp = __dirname;
const raizDoMonorepo = path.resolve(pastaDoApp, '../..');

const config = getDefaultConfig(pastaDoApp);
config.watchFolders = [raizDoMonorepo];
config.resolver.unstable_enablePackageExports = true;
config.resolver.nodeModulesPaths = [
  path.resolve(pastaDoApp, 'node_modules'),
  path.resolve(raizDoMonorepo, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
