const LCUConnector = require('lcu-connector');
const chalk = require('chalk')
const fetch = require('node-fetch')
const https = require('https')

const connector = new LCUConnector();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

let intervalId = ''
let lastPhase = 

console.log(chalk.blue([
  " __                           _____     _     ",
  "|  |   ___ ___ ___ _ _ ___   |   __|___|_|___ ",
  "|  |__| -_| .'| . | | | -_|  |__   |   | | . |",
  "|_____|___|__,|_  |___|___|  |_____|_|_|_|  _|",
  "              |___|                      |_|  "
].join('\n')))

console.log(`\n             League Snip v${require('../package.json').version}\n`)

connector.on('connect', (data) => {
  console.log('Connected to the League Client')
  intervalId = setInterval(() => {
    fetch(`https://${data.address}:${data.port}/lol-gameflow/v1/gameflow-phase`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${data.username}:${data.password}`).toString('base64')}`
      },
      agent: httpsAgent
    }).then(res => res.json()).then(phase => {
      if (phase !== lastPhase) {
        lastPhase = phase
        console.log(phase)
      }
    })
  }, 200)
});

connector.on('disconnect', () => {
  console.log('Disconnected from the League Client')
  clearInterval(intervalId)
});

connector.start()