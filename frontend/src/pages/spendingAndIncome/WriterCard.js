import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import NotFixedWriter from './Writer/NotFixedWriter';
import FixedWriter from './Writer/FixedWriter';

import { useCreateColumnMutation } from 'queries/accountBook/accountBookMutation';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const WriterCard = ({ accountBookId, categoryList, writeType }) => {
	const { mutate: createColumnMutate } = useCreateColumnMutation();

	const onMutateSuccess = () => {};
	const onMutateError = () => {};

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
	categoryList: PropTypes.array.isRequired,
	writeType: PropTypes.oneOf(['nf', 'f']).isRequired,
};

export default WriterCard;
