import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Autocomplete,
    TextField,
    Chip,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const AddUserInContract = ({ open, onClose, room, userOptions, onConfirm }) => {
    const maxSelectable = room?.maxOccupants - room?.tenant?.length || 0;
    const availableTenants = userOptions.filter(
        (user) =>
            user.role === 'user' && user.isVerifiedByAdmin && !room?.tenant.includes(user._id),
    );
    const validationSchema = Yup.object().shape({
        tenants: Yup.array()
            .min(1, 'Phải chọn ít nhất một người')
            .max(maxSelectable, `Chỉ thêm tối đa ${maxSelectable} người`)
            .of(Yup.object().required()),
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Chọn người thuê</DialogTitle>
            <Formik
                initialValues={{ tenants: [] }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onConfirm(values);
                    onClose();
                }}
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form>
                        <DialogContent>
                            <Autocomplete
                                multiple
                                options={availableTenants}
                                getOptionLabel={(option) => option.fullname}
                                value={values.tenants}
                                onChange={(e, value) => setFieldValue('tenants', value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Người thuê"
                                        variant="standard"
                                        error={touched.tenants && Boolean(errors.tenants)}
                                        helperText={touched.tenants && errors.tenants}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) =>
                                        (() => {
                                            const tagProps = getTagProps({ index });
                                            const { key, ...rest } = tagProps;
                                            return (
                                                <Chip
                                                    key={option._id} // key đặt riêng
                                                    label={option.fullname}
                                                    {...rest} // còn lại spread sau
                                                />
                                            );
                                        })(),
                                    )
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>Hủy</Button>
                            <Button type="submit" variant="contained">
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AddUserInContract;
