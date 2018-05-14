/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    defaultAddressId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    scope: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    source: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cardId: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
