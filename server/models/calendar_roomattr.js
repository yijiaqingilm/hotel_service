/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('calendar_roomattr', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'calendar',
        key: 'id'
      }
    },
    rid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'roomattr',
        key: 'rmattrId'
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    vipprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    oprice: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'calendar_roomattr'
  });
};
