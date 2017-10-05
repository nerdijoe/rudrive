'use strict';
module.exports = (sequelize, DataTypes) => {
  var About = sequelize.define('About', {
    overview: DataTypes.TEXT,
    work: DataTypes.TEXT,
    education: DataTypes.TEXT,
    contact_info: DataTypes.STRING,
    life_events: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        About.belongsTo(models.User, { foreignKey: 'user_id' })
      }
    }
  });
  return About;
};
