/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room', {
    rid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    img: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    checkInTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    checkOutTime: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true
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
    },
    rooms: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    roomTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'roomtype',
        key: 'roomTypeId'
      }
    },
    roomAttrId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'roomattr',
        key: 'rmattrId'
      }
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'room'
  });
};
