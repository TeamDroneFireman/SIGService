module.exports = function(Sig) {
  Sig.disableRemoteMethod('deleteById', true);
  Sig.disableRemoteMethod('updateAll', true);
  Sig.disableRemoteMethod('createChangeStream', true);
  Sig.disableRemoteMethod('findOne', true);
  Sig.disableRemoteMethod('exists', true);
};
