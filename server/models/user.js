'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasOne(models.About, { foreignKey: 'user_id' });
        User.hasOne(models.Interest, { foreignKey: 'user_id' });
        
      }
    }
  });
  return User;
};
