module.exports = function(Sig) {
  const USERSERVICE_URL = 'http://projetm2gla.istic.univ-rennes1.fr:12346/';
  Sig.beforeRemote('*', function(ctx, unused, next) {
    Sig.app.datasources.auth
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
  Sig.disableRemoteMethod('deleteById', true);
  Sig.disableRemoteMethod('updateAll', true);
  Sig.disableRemoteMethod('createChangeStream', true);
  Sig.disableRemoteMethod('findOne', true);
  Sig.disableRemoteMethod('exists', true);
};
