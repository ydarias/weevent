// Generated by CoffeeScript 1.3.3
(function() {
  var allowCrossDomain, app, express, log, logAccess, logger, schema;

  express = require('express');

  logger = require('./logger');

  schema = require('./schema');

  log = logger.factory.buildLogger(logger.level.INFO);

  app = express();

  allowCrossDomain = function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'no-cache');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    return next();
  };

  logAccess = function(req, res, next) {
    log.info('Access on ' + req.path);
    return next();
  };

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
    return app.use(logAccess);
  });

  app.get('/api/events', function(request, response) {
    var query;
    query = schema.Event.find();
    return query.exec(function(error, events) {
      if (error) {
        response.status(400);
        return response.json({
          error: 'Error obtaining events list'
        });
      } else {
        return response.json(events);
      }
    });
  });

  app.post('/api/events', function(request, response) {
    var event;
    event = new schema.Event({
      name: request.body.name,
      description: request.body.description,
      startDate: request.body.startDate,
      endDate: request.body.endDate
    });
    return event.save(function(error) {
      if (error) {
        response.status(400);
        return response.json({
          error: 'Error saving event'
        });
      } else {
        return response.json(event);
      }
    });
  });

  app.options('/api/events', function(request, response) {
    return response.end('OK');
  });

  app.get('/api/events/:eventId', function(request, response) {
    var query;
    query = schema.Event.findOne({
      '_id': request.params.eventId
    });
    return query.exec(function(error, event) {
      if (error) {
        response.status(400);
        return response.json({
          error: 'Error obtaining event with id ' + request.params.eventId
        });
      } else {
        return response.json(event);
      }
    });
  });

  app.post('/api/events/:eventId/session', function(request, response) {
    var session;
    session = new schema.Session({
      name: request.body.name,
      description: request.body.description
    });
    return schema.Event.findById(request.params.eventId).exec(function(error, event) {
      if (error) {
        response.status(400);
        return response.json({
          error: 'Error creating session: event with id ' + request.params.eventId + ' does not exists'
        });
      } else {
        event.sessions.push(session);
        return event.save(function(error) {
          if (error) {
            response.status(400);
            return response.json({
              error: 'Error saving the new session in the given event'
            });
          } else {
            return response.json(session);
          }
        });
      }
    });
  });

  log.info('Server is ready in port 8080');

  app.listen(8080);

}).call(this);