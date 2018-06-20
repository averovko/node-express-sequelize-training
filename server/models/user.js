const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      allowEmpty: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
    gender: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
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
  });

  User.associate = (models) => {
    User.belongsTo(models.Address, {
      as: 'address',
      foreignKey: 'addressId',
    });

    User.hasMany(models.Client, {
      as: 'clients',
      foreignKey: 'userId', 
    });
    User.hasMany(models.Contract, {
      as: 'contracts',
      foreignKey: 'userId', 
    });
  };

  User.validPassword = (password, passwd, done, user) => {
    bcrypt.compare(password, passwd, (err, isMatch) => {
      if (err) console.log(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  };

  User.beforeUpdate((user, options) => hashPassword(user, options));
  User.beforeCreate((user, options) => hashPassword(user, options));

  return User;
};

hashPassword = (user, options) => {
  const SALT_FACTOR = 12;

  if (!user.changed('password')) return;
  const salt = bcrypt.genSalt(SALT_FACTOR, (err, salt) => { return salt; });
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, salt, null, (err, hash, next) => {
      if (err) return err;
      user.password = hash;
      return resolve(user, options);
    });
  });
};