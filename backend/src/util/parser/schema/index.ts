import accountBookSchema from './accountBookSchema';
import authSchema from './authSchema';
import userSchema from './userSchema';
import headerSchema from './headerSchema';
import groupSchema from './groupSchema';
import manageCategorySchema from './manageCategorySchema';

export default {
	auth: authSchema,
	accountBook: accountBookSchema,
	user: userSchema,
	header: headerSchema,
	group: groupSchema,
	manageCategory: manageCategorySchema,
};
