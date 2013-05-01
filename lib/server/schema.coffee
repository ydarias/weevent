mongoose = require 'mongoose'
mongoose.connect('localhost', 'weevent')

sessionSchema = new mongoose.Schema
  name: 'String'
  description: 'String'

eventSchema = new mongoose.Schema
  name: 'String'
  description: 'String',
  startDate:
    type: 'Date',
  endDate:
    type: 'Date',
  sessions: [ sessionSchema ]

module.exports.Session =  mongoose.model('Session', sessionSchema)
module.exports.Event = mongoose.model('Event', eventSchema)