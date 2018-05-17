/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    orderId: {
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
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    couponId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sktime: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ottime: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    payType: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    addressId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'address',
        key: 'addressId'
      }
    },
    orderNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    source: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    payStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'order'
  });
};
