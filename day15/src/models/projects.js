'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  projects.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    StartDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    distanceTime: DataTypes.STRING,
    technologies: DataTypes.STRING,
    image: DataTypes.STRING,
    author: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'projects',
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp'
  });
  return projects;
};