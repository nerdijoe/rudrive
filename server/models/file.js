'use strict';
module.exports = (sequelize, DataTypes) => {
  var File = sequelize.define('File', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    full_path: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.INTEGER,
    is_starred: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        File.belongsTo(models.User, { foreignKey: 'user_id' })
        File.hasMany(models.FileSharing, { foreignKey: 'file_id' });
        
      }
    }
  });
  return File;
};
