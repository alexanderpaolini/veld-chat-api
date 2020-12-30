const { Embed } = require('./lib/Embed');

module.exports = {
  Client: require('./lib/Client').Client,
  Message: require('./lib/Message').Message,
  Channel: require('./lib/Channel').Channel,
  Embed: require('./lib/Embed').Embed
}