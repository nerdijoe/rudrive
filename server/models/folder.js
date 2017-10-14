'use strict';
module.exports = (sequelize, DataTypes) => {
  var Folder = sequelize.define('Folder', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    full_path: DataTypes.STRING,
    is_starred: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Folder.belongsTo(models.User, { foreignKey: 'user_id' })
        Folder.hasMany(models.FolderSharing, { foreignKey: 'folder_id' });
        
      }
    }
  });
  return Folder;
};
