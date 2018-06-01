/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_room', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'order',
        key: 'orderId'
      }
    },
    room_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'room',
        key: 'rid'
      }
    }
  }, {
    tableName: 'order_room'
  });
};
