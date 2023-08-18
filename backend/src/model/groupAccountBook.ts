/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import CategoryModel from './category';

import { TModelInfo } from '@/interface/model';
import GroupModel from './group';

export class GroupAccountBookModel extends Model<
	InferAttributes<GroupAccountBookModel>,
	InferCreationAttributes<GroupAccountBookModel>
> {
	declare categoryId: ForeignKey<CategoryModel['id']>;
	declare content: string;
	declare createdAt: CreationOptional<Date>;
	declare groupId: ForeignKey<GroupModel['id']>;

	declare id: CreationOptional<number>;

	declare value: number;
}

GroupAccountBookModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		value: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'groupaccountbooks',
		createdAt: true,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	GroupAccountBookModel.belongsTo(model.groups, {
		targetKey: 'id',
		foreignKey: 'groupId',
		as: 'groups',
	});
	GroupAccountBookModel.belongsTo(model.categorys, {
		targetKey: 'id',
		foreignKey: 'categoryId',
		as: 'categorys',
	});
};

export default GroupAccountBookModel;
