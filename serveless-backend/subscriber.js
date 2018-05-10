// Subscriber
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')


client.on('connect', () => {
  client.subscribe('notetaking/public')
})


client.on('message', (topic, message) => {
  switch (topic) {
    case 'notetaking/public':
      return handleNewPublicNote(message)
  }
  console.log('No handler for topic %s', topic)
})


function handleNewPublicNote (message) {
  console.log('New note found %s', message)
  displayNote(message.toString())
}
