/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sys_roles_rules', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roles_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sys_roles',
        key: 'rolesId'
      }
    },
    rules_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'sys_rules',
        key: 'rulesId'
      }
    }
  }, {
    tableName: 'sys_roles_rules'
  });
};
