
const mongoose = require('mongoose');

const emojiSchema = new mongoose.Schema({
name: String,
icon: String,
triggers: {
  nouns: Array,
  verbs: Array,
  adjectives: Array
}
})

const Emoji = mongoose.model('Emoji', emojiSchema);

module.exports = Emoji;
