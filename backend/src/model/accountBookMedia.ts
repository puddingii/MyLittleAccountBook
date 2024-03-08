/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';

import { TModelInfo } from '@/interface/model';
import AccountBookModel from './accountBook';

/**
 * 가계부 관련 미디어 정보
 */
class AccountBookMediaModel extends Model<
	InferAttributes<AccountBookMediaModel>,
	InferCreationAttributes<AccountBookMediaModel>
> {
	declare accountBookId: ForeignKey<AccountBookModel['id']>;
	declare accountbooks?: NonAttribute<AccountBookModel>;
	declare createdAt: CreationOptional<Date>;
	declare id: CreationOptional<number>;
	declare isSaved: boolean;
	declare mimeType: string;
	declare name: string;
	declare path: string;
	declare size: number;
	declare updatedAt: CreationOptional<Date>;
}

AccountBookMediaModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		isSaved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		path: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mimeType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		size: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'accountbookmedias',
		createdAt: true,
		updatedAt: true,
	},
);

export const associate = (model: TModelInfo) => {
	AccountBookMediaModel.belongsTo(model.accountbooks, {
		targetKey: 'id',
		foreignKey: 'accountBookId',
		as: 'accountbooks',
		hooks: true,
		onDelete: 'cascade',
	});
	AccountBookMediaModel.hasMany(model.groups, {
		constraints: false,
		as: 'groups',
		foreignKey: { allowNull: false, name: 'accountBookId' },
		sourceKey: 'accountBookId',
	});
};

export default AccountBookMediaModel;
