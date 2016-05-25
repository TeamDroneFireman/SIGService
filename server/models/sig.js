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
  Sig.getByIntervention= function(id, callback) {
    Sig.find({ where: {intervention: id} }, function(err, Sigs) {
      callback(null, Sigs);
    });
  };

  Sig.remoteMethod(
    'getByIntervention',
    {
      http: {path: '/intervention/:id', verb: 'get'},
      accepts: {arg: 'id', type: 'string', required: true},
      returns: {type: 'array', root: true}
    }
  );

};
