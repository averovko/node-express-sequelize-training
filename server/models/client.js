module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    orgName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'org_name',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_enabled',
    },
    addressId: {
      type: DataTypes.INTEGER,
      field: 'address_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
  });

  Client.associate = (models) => {
    Client.belongsTo(models.Address, {
      as: 'address',
      foreignKey: 'addressId',
    });
    Client.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Client.hasMany(models.Contract, {
      as: 'contracts',
      foreignKey: 'clientId', 
    });
  };

  return Client;
};