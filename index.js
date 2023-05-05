const { Client } = require('discord.js-selfbot-v13');
const request = require('request');
const config = require('./config');
const prefix = config.client.prefix;

const client = new Client({
  checkUpdate: false,
});

let lockInterval = null;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.client.prefix)) return;

  const args = message.content.slice(config.client.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'grouplock') {
    const groupid = args[0];
    if (!groupid) return message.edit('Please provide a group ID.');
    if (lockInterval) clearInterval(lockInterval);
    lockInterval = setInterval(async () => {
      request(`https://discord.com/api/v9/channels/${groupid}/recipients/${client.user.id}`, {
        "headers": {
          "accept": "*/*",
          "authorization": `${config.client.token}`,
        },
        "method": "PUT",
      }, (err, response, body) => false)
    }, 350)
    message.edit(`Group \`${groupid}\` locked!`);
  } else if (command === 'groupunlock') {
    if (lockInterval) clearInterval(lockInterval);
    lockInterval = null;
    message.edit(`Group unlock !`);
  }
});

client.login(config.client.token);