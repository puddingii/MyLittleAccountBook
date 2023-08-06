import UserModel from './user';
import OAuthUserModel from './oauthUser';

UserModel.hasMany(OAuthUserModel, {
	onDelete: 'cascade',
	hooks: true,
	as: 'oauthusers',
	foreignKey: { allowNull: false, name: 'userEmail' },
	sourceKey: 'email',
});

OAuthUserModel.belongsTo(UserModel, {
	targetKey: 'email',
	foreignKey: 'userEmail',
	as: 'users',
});
