import { Backdrop, Modal, Fade, Box } from '@mui/material';
import PropTypes from 'prop-types';

import MainCard from 'components/MainCard';
import NotFixedWriter from './Writer/NotFixedWriter';
import FixedWriter from './Writer/FixedWriter';
import { usePatchColumnMutation } from 'queries/accountBook/accountBookMutation';

const boxStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	// border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const EditModal = ({
	open,
	handleClose,
	manageType,
	accountBookId,
	categoryList,
	selectedRow,
	updateColumn,
	setSnackbarInfo,
}) => {
	const { mutate: patchColumnMutate } = usePatchColumnMutation();

	const onMutateSuccess = (response, editedHistory) => {
		const category = categoryList.find(category => category.childId === editedHistory.category);
		const categoryName = category ? category.categoryNamePath : '';
		updateColumn({ ...editedHistory, category: categoryName });
		setSnackbarInfo({ isOpen: true, message: '수정되었습니다.', severity: 'success' });
	};
	const onMutateError = error => {
		setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
	};

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={boxStyle}>
					<MainCard contentSX={{ p: 2.25 }}>
						{manageType === 'nf' ? (
							<NotFixedWriter
								accountBookId={accountBookId}
								categoryList={categoryList}
								mutate={patchColumnMutate}
								onMutateError={onMutateError}
								onMutateSuccess={onMutateSuccess}
								customInitialValue={selectedRow}
								isEditForm={true}
							/>
						) : (
							<FixedWriter
								accountBookId={accountBookId}
								categoryList={categoryList}
								mutate={patchColumnMutate}
								onMutateError={onMutateError}
								onMutateSuccess={onMutateSuccess}
								customInitialValue={selectedRow}
								isEditForm={true}
							/>
						)}
					</MainCard>
				</Box>
			</Fade>
		</Modal>
	);
};

EditModal.propTypes = {
	accountBookId: PropTypes.number.isRequired,
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	updateColumn: PropTypes.func.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	manageType: PropTypes.oneOf(['nf', 'f']).isRequired,
	categoryList: PropTypes.array,
	selectedRow: PropTypes.object.isRequired,
};

export default EditModal;
