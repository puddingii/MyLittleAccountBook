/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import { TModelInfo } from '@/interface/user';

class CategoryModel extends Model<
	InferAttributes<CategoryModel>,
	InferCreationAttributes<CategoryModel>
> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare parentId?: number;
}

CategoryModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		parentId: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'categories',
		createdAt: false,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {};

export default CategoryModel;
