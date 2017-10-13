'use strict';
// const User = require('./user');
// const File = require('./file');
const db = require('./index');

module.exports = (sequelize, DataTypes) => {
  var FileSharing = sequelize.define('FileSharing', {
    file_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

        // models.File.belongsToMany(models.User, { through: models.FileSharing ,foreignKey: 'file_id' })
        // models.User.belongsToMany(models.File, { through: models.FileSharing ,foreignKey: 'user_id' })

        
      }
    }
  });

  return FileSharing;
};
