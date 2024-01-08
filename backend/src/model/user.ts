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
import GroupModel from './group';

import { TModelInfo } from '@/interface/model';

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	declare addGroup: HasManyAddAssociationMixin<GroupModel, number>;
	declare addGroups: HasManyAddAssociationsMixin<GroupModel, number>;
	declare addOauthuser: HasManyAddAssociationMixin<OAuthUser, number>;
	declare addOauthusers: HasManyAddAssociationsMixin<OAuthUser, number>;
	declare countGroups: HasManyCountAssociationsMixin;
	declare countOauthusers: HasManyCountAssociationsMixin;
	declare createdAt: CreationOptional<Date>;
	declare createGroup: HasManyCreateAssociationMixin<GroupModel, 'userEmail'>;
	declare createOauthuser: HasManyCreateAssociationMixin<OAuthUser, 'userEmail'>;
	declare email: string;
	declare getGroups: HasManyGetAssociationsMixin<GroupModel>;
	declare getOauthusers: HasManyGetAssociationsMixin<OAuthUser>;
	declare groups?: NonAttribute<GroupModel[]>;
	declare hasGroup: HasManyHasAssociationMixin<GroupModel, number>;
	declare hasGroups: HasManyHasAssociationsMixin<GroupModel, number>;
	declare hasOauthuser: HasManyHasAssociationMixin<OAuthUser, number>;
	declare hasOauthusers: HasManyHasAssociationsMixin<OAuthUser, number>;
	declare isAuthenticated: boolean;
	declare nickname: string;
	declare oauthusers?: NonAttribute<OAuthUser[]>;
	declare password?: string;
	declare removeGroup: HasManyRemoveAssociationMixin<GroupModel, number>;
	declare removeGroups: HasManyRemoveAssociationsMixin<GroupModel, number>;
	declare removeOauthuser: HasManyRemoveAssociationMixin<OAuthUser, number>;
	declare removeOauthusers: HasManyRemoveAssociationsMixin<OAuthUser, number>;
	declare setGroups: HasManySetAssociationsMixin<GroupModel, number>;
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
		isAuthenticated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},
	{ sequelize, modelName: 'users' },
);

export const associate = (model: TModelInfo) => {
	UserModel.hasMany(model.oauthusers, {
		onDelete: 'cascade',
		hooks: true,
		as: 'oauthusers',
		foreignKey: { allowNull: false, name: 'userEmail' },
		sourceKey: 'email',
	});
	UserModel.hasMany(model.groups, {
		onDelete: 'cascade',
		hooks: true,
		as: 'groups',
		foreignKey: { allowNull: false, name: 'userEmail' },
		sourceKey: 'email',
	});
};

export default UserModel;
