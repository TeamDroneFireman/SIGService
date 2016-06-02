module.exports = function(Sig) {

/*
  Sig.beforeRemote('*', function(ctx, unused, next) {
    Sig.app.datasources.userService
    .checkAuth(ctx.req.headers.userid, ctx.req.headers.token,
        function (err, response) {
      if (err || response.error || response.id !== ctx.req.headers.token) {
        var e = new Error('You must be logged in to access database');
        e.status = 401;
        next(e);
      } else {
        next();
      }
    });
  });
*/

  //Sig.disableRemoteMethod('deleteById', true);
  Sig.disableRemoteMethod('updateAll', true);
  Sig.disableRemoteMethod('createChangeStream', true);
  Sig.disableRemoteMethod('findOne', true);
  Sig.disableRemoteMethod('exists', true);

  /**
  * return all the SIG used in the intervention passed as parameter
  * @param id
  * @param callback
  */
  Sig.getByIntervention = function(id, callback) {
    var interventionService = Sig.app.dataSources.interventionService;
    interventionService.exists(id,function(err, response) {
      if (err) throw err;
      if (response.error) next('> response error: ' + response.error.stack);
      if (response.exists) {
        Sig.find({where: {intervention: id}}, function (err, Sigs) {
          if (Sigs === null) Sigs = [];
          var sigExternService = Sig.app.dataSources.sigExternService;
          interventionService.findById(id, function (err, response) {
            if (err) throw err;
            if (response.error)
              next('> response error: ' + response.error.stack);
            sigExternService.getSigListMock(response.location.address,
              function (err, response) {
                if (err) throw err;
                if (response.error)
                  next('> response error: ' + response.error.stack);
                Sigs.push.apply(Sigs, response);
                callback(null, Sigs);
              });
          });
        });
      }
      else callback(null, []);
    });
  };

  Sig.remoteMethod(
    'getByIntervention',
    {
      http: {path: '/intervention/:id', verb: 'get'},
      accepts: {arg: 'id', type: 'string', required: true},
      returns: {type: 'array', root: true},
      rest: {after: convertNullToNotFoundError}
    }
  );


  function convertNullToNotFoundError(ctx, cb) {
    if (ctx.result !== null) return cb();

    var modelName = ctx.method.sharedClass.name;
    var id = ctx.getArgByName('id');
    var msg = 'Unknown "' + modelName + '" id "' + id + '".';
    var error = new Error(msg);
    error.statusCode = error.status = 404;
    error.code = 'MODEL_NOT_FOUND';
    cb(error);
  }

  Sig.afterRemote('create',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Sig/Create');
    next();
  });

  Sig.afterRemote('prototype.updateAttributes',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Sig/Create');
    next();
  });

  Sig.afterRemote('upsert',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Sig/Update');
    next();
  });

  Sig.afterRemote('updateAll',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Drone/Update');
    next();
  });

  Sig.afterRemote('deleteById',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Sig/Delete');
    next();
  });

  function sendPushMessage(sig,topic){
    var pushMessage = {
      idIntervention : sig.intervention,
      idElement : sig.id,
      timestamp : new Date(Date.now()),
      topic : topic
    };
    var pushService = Sig.app.datasources.pushService;
    pushService.create(pushMessage, function(err,data){
      if (err) throw err;
      if (data.error)
        next('> response error: ' + err.error.stack);
    });
  }

};
