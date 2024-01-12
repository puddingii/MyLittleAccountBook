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
import UserModel from './user';
import { TModelInfo } from '@/interface/model';

export class OAuthUserModel extends Model<
	InferAttributes<OAuthUserModel>,
	InferCreationAttributes<OAuthUserModel>
> {
	declare createdAt: CreationOptional<Date>;
	declare id: CreationOptional<number>;
	/** Type 종류: Default, Google, Naver */
	declare type: string;
	declare userEmail: ForeignKey<UserModel['email']>;
	declare users?: NonAttribute<UserModel>;
}

OAuthUserModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
	},
	{
		sequelize,
		modelName: 'oauthusers',
		createdAt: true,
		updatedAt: false,
	},
);

export const associate = (model: TModelInfo) => {
	OAuthUserModel.belongsTo(model.users, {
		targetKey: 'email',
		foreignKey: 'userEmail',
		as: 'users',
		hooks: true,
		onDelete: 'cascade',
	});
};

export default OAuthUserModel;
