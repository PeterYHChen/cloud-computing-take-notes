//Publisher
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', () => {
  client.subscribe('notetaking/public')
})


function sendStateUpdate (newPost) {
  console.log('sending new post %s', newPost)
  client.publish('notetaking/public', newPost)
}


/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit (options, err) {
  if (err) {
    console.log(err.stack)
  }

  if (options.exit) {
    process.exit()
  }
}

function handleCloseRequest (message) {
  if (state !== 'closed' && state !== 'closing') {
    state = 'closing'
  
    setTimeout(() => {
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}


/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
  exit: true
}))
