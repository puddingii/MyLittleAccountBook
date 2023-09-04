import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import NotFixedWriter from './Writer/NotFixedWriter';
import FixedWriter from './Writer/FixedWriter';

import { useCreateColumnMutation } from 'queries/accountBook/accountBookMutation';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const WriterCard = ({ accountBookId, categoryList, writeType, addHistory, setSnackbarInfo }) => {
	const { mutate: createColumnMutate } = useCreateColumnMutation();

	const onMutateSuccess = (response, addedHistory) => {
		const category = categoryList.find(category => category.childId === addedHistory.category);
		const categoryName = category ? category.categoryNamePath : '';
		addHistory({ ...addedHistory, category: categoryName, gabId: response?.data?.newId });
		setSnackbarInfo({ isOpen: true, message: '성공적으로 작성되었습니다.', severity: 'success' });
	};
	const onMutateError = error => {
		setSnackbarInfo({ isOpen: true, message: error, severity: 'error' });
	};

	return (
		<MainCard sx={{ mt: 2 }} content={false}>
			<Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
				{writeType === 'nf' ? (
					<NotFixedWriter
						accountBookId={accountBookId}
						categoryList={categoryList}
						mutate={createColumnMutate}
						onMutateError={onMutateError}
						onMutateSuccess={onMutateSuccess}
					/>
				) : (
					<FixedWriter
						accountBookId={accountBookId}
						categoryList={categoryList}
						mutate={createColumnMutate}
						onMutateError={onMutateError}
						onMutateSuccess={onMutateSuccess}
					/>
				)}
			</Box>
		</MainCard>
	);
};

WriterCard.propTypes = {
	accountBookId: PropTypes.number.isRequired,
	addHistory: PropTypes.func.isRequired,
	categoryList: PropTypes.array.isRequired,
	writeType: PropTypes.oneOf(['nf', 'f']).isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
};

export default WriterCard;
