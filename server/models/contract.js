module.exports = (sequelize, DataTypes) => {
  var Contract = sequelize.define('Contract', {
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'project_name',
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'client_id',
    },
  });

  Contract.associate = (models) => {
    Contract.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Contract.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
  };

  return Contract;
};
