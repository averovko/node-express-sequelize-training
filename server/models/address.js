module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    addressLine1: {
      type: DataTypes.STRING,
      field: 'address_line_1',
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
      field: 'address_line_2',
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      field: 'postal_code',
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Address.associate = (models) => { };

  return Address;
};