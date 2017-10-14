'use strict';
module.exports = (sequelize, DataTypes) => {
  var FolderSharing = sequelize.define('FolderSharing', {
    folder_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return FolderSharing;
};