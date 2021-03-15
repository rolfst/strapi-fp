const chokidar = require('chokidar')
const cluster = require('cluster')
const strapi = require('strapi')

const strapiInstance = strapi({ autoReload: true })
return strapiInstance.start()
// try {
//
//   if (cluster.isMaster) {
//     cluster.on('message', (worker, message) => {
//       switch (message) {
//         case 'reload':
//           strapiInstance.log.info('The server is restarting\n')
//           worker.send('isKilled')
//           break
//         case 'kill':
//           worker.kill()
//           cluster.fork()
//           break
//         case 'stop':
//           worker.kill()
//           process.exit(1)
//           break
//         default:
//           return
//       }
//     })
//
//     cluster.fork()
//   }
//
//   if (cluster.isWorker) {
//     watchFileChanges({ strapiInstance })
//
//     process.on('message', message => {
//       switch (message) {
//         case 'isKilled':
//           strapiInstance.server.destroy(() => {
//             process.send('kill')
//           })
//           break
//         default:
//         // Do nothing.
//       }
//     })
//
//   }
// } catch (e) {
//   strapi.log.error(e)
//   process.exit(1)
// }
//
// /**
//  * Init file watching to auto restart strapi app
//  * @param {Object} options - Options object
//  * @param {string} options.dir - This is the path where the app is located, the watcher will watch the files under this folder
//  * @param {Strapi} options.strapi - Strapi instance
//  */
// function watchFileChanges({ dir, strapiInstance }) {
//   const restart = () => {
//     if (
//       strapiInstance.reload.isWatching &&
//       !strapiInstance.reload.isReloading
//     ) {
//       strapiInstance.reload.isReloading = true
//       strapiInstance.reload()
//     }
//   }
//
//   const watcher = chokidar.watch(dir, {
//     ignoreInitial: true,
//     ignored: [
//       /(^|[/\\])\../,
//       /tmp/,
//       '**/admin',
//       '**/admin/**',
//       '**/components',
//       '**/components/**',
//       '**/documentation',
//       '**/documentation/**',
//       '**/node_modules',
//       '**/node_modules/**',
//       '**/plugins.json',
//       '**/index.html',
//       '**/public',
//       '**/public/**',
//       '**/cypress',
//       '**/cypress/**',
//       '**/*.db*',
//       '**/exports/**'
//     ]
//   })
//
//   watcher
//     .on('add', path => {
//       strapiInstance.log.info(`File created: ${path}`)
//       restart()
//     })
//     .on('change', path => {
//       strapiInstance.log.info(`File changed: ${path}`)
//       restart()
//     })
//     .on('unlink', path => {
//       strapiInstance.log.info(`File deleted: ${path}`)
//       restart()
//     })
// }
//
