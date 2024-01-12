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
	HasOneCreateAssociationMixin,
	HasOneGetAssociationMixin,
	HasOneSetAssociationMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
} from 'sequelize';

import sequelize from '@/loader/mysql';
import OAuthUser from './oauthUser';
import UserPrivacy from './userPrivacy';
import GroupModel from './group';

import { TModelInfo } from '@/interface/model';

export class UserModel extends Model<
	InferAttributes<UserModel>,
	InferCreationAttributes<UserModel>
> {
	declare addGroup: HasManyAddAssociationMixin<GroupModel, GroupModel['id']>;
	declare addGroups: HasManyAddAssociationsMixin<GroupModel, GroupModel['id']>;
	declare addOauthuser: HasManyAddAssociationMixin<OAuthUser, OAuthUser['id']>;
	declare addOauthusers: HasManyAddAssociationsMixin<OAuthUser, OAuthUser['id']>;
	declare countGroups: HasManyCountAssociationsMixin;
	declare countOauthusers: HasManyCountAssociationsMixin;
	declare createdAt: CreationOptional<Date>;
	declare createGroup: HasManyCreateAssociationMixin<GroupModel, 'userEmail'>;
	declare createOauthuser: HasManyCreateAssociationMixin<OAuthUser, 'userEmail'>;
	declare createUserprivacy: HasOneCreateAssociationMixin<UserPrivacy>;
	declare email: string;
	declare getGroups: HasManyGetAssociationsMixin<GroupModel>;
	declare getOauthusers: HasManyGetAssociationsMixin<OAuthUser>;
	declare getUserprivacy: HasOneGetAssociationMixin<UserPrivacy>;
	declare groups?: NonAttribute<GroupModel[]>;
	declare hasGroup: HasManyHasAssociationMixin<GroupModel, GroupModel['id']>;
	declare hasGroups: HasManyHasAssociationsMixin<GroupModel, GroupModel['id']>;
	declare hasOauthuser: HasManyHasAssociationMixin<OAuthUser, OAuthUser['id']>;
	declare hasOauthusers: HasManyHasAssociationsMixin<OAuthUser, OAuthUser['id']>;
	declare nickname: string;
	declare oauthusers?: NonAttribute<OAuthUser[]>;
	declare password?: string;
	declare removeGroup: HasManyRemoveAssociationMixin<GroupModel, GroupModel['id']>;
	declare removeGroups: HasManyRemoveAssociationsMixin<GroupModel, GroupModel['id']>;
	declare removeOauthuser: HasManyRemoveAssociationMixin<OAuthUser, OAuthUser['id']>;
	declare removeOauthusers: HasManyRemoveAssociationsMixin<OAuthUser, OAuthUser['id']>;
	declare setGroups: HasManySetAssociationsMixin<GroupModel, GroupModel['id']>;
	declare setOauthusers: HasManySetAssociationsMixin<OAuthUser, OAuthUser['id']>;
	declare setUserprivacy: HasOneSetAssociationMixin<UserPrivacy, UserPrivacy['id']>;
	declare updatedAt: CreationOptional<Date>;
	declare userprivacy?: NonAttribute<UserPrivacy>;
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
	UserModel.hasMany(model.oauthusers, {
		onDelete: 'cascade',
		hooks: true,
		as: 'oauthusers',
		foreignKey: { allowNull: false, name: 'userEmail' },
		sourceKey: 'email',
	});
	UserModel.hasOne(model.userprivacys, {
		onDelete: 'cascade',
		hooks: true,
		as: 'userprivacy',
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
