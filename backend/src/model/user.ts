/* eslint-disable no-use-before-define */
import {
	CreationOptional,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManySetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import OAuthUser from './oauthUser';

import { TModelInfo } from '@/interface/user';

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	declare addOauthuser: HasManyAddAssociationMixin<OAuthUser, number>;
	declare addOauthusers: HasManyAddAssociationsMixin<OAuthUser, number>;
	declare countOauthusers: HasManyCountAssociationsMixin;
	declare createdAt: CreationOptional<Date>;
	declare createOauthuser: HasManyCreateAssociationMixin<OAuthUser, 'userEmail'>;
	declare email: string;
	declare getOauthusers: HasManyGetAssociationsMixin<OAuthUser>;
	declare hasOauthuser: HasManyHasAssociationMixin<OAuthUser, number>;
	declare hasOauthusers: HasManyHasAssociationsMixin<OAuthUser, number>;
	declare nickname: string;
	declare oauthusers?: NonAttribute<OAuthUser[]>;
	declare password?: string;
	declare removeOauthuser: HasManyRemoveAssociationMixin<OAuthUser, number>;
	declare removeOauthusers: HasManyRemoveAssociationsMixin<OAuthUser, number>;
	declare setOauthusers: HasManySetAssociationsMixin<OAuthUser, number>;
	declare updatedAt: CreationOptional<Date>;
}

UserModel.init(
	{
		email: {
			primaryKey: true,
			type: DataTypes.STRING,
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ sequelize, modelName: 'users' },
);

export const associate = (model: TModelInfo) => {
	UserModel.hasMany(model.OAuthUserModel, {
		onDelete: 'cascade',
		hooks: true,
		as: 'oauthusers',
		foreignKey: { allowNull: false, name: 'userEmail' },
		sourceKey: 'email',
	});
};

export default UserModel;
