module.exports = function(Sig) {
  Sig.disableRemoteMethod('deleteById', true);
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
    })
  };

  Sig.remoteMethod(
    'getByIntervention',
    {
      http: {path: '/intervention/:id', verb: 'get'},
      accepts: {arg: 'id', type: 'number', required: true},
      returns: {type: 'array', root: true}
    }
  );

};
