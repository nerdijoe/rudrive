'use strict';
module.exports = (sequelize, DataTypes) => {
  var Interest = sequelize.define('Interest', {
    music: DataTypes.TEXT,
    shows: DataTypes.TEXT,
    sports: DataTypes.TEXT,
    fav_teams: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Interest.belongsTo(models.User, { foreignKey: 'user_id' })
        
      }
    }
  });
  return Interest;
};
