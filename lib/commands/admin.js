const Team = require('../models/team')
const slack = require('slack')
const bluebird = require('bluebird')
const chat = bluebird.promisifyAll(slack.chat)

module.exports.command = 'admin <message>'
module.exports.desc = 'Sends a message to the admin channel'
module.exports.handler = admin

function admin (argv) {
  argv.respond(Team.get(argv.team_id).then(team => {
    const token = team.bot.bot_access_token
    const chan = (argv.channel_name === 'directmessage')
    ? 'a DM'
    : (argv.channel_name) === 'privategroup'
    ? 'a private channel'
    : `<#${argv.channel_id}>`
    console.log('WHAT IS THE CHANNEL')
    console.log(chan)
    console.log(token)
    return chat.postMessageAsync({
      token,
      channel: 'admin',
      text: `Message from <@${argv.user_id}> in ${chan}:\n\n${argv.text}`
    })
  }).then(() => ({
    text: 'Admins have been notified. They will respond as soon as possible.'
  })))
}
