import useUser from "@/hook/useUser";
import { IUserForm } from "@/interface/authentication";
import { handleSuccess } from "@/utils/helper";
import { Box, Button, Flex, Loader, LoadingOverlay, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import 'dayjs/locale/th';
import { useEffect } from "react";
import * as yup from 'yup';

interface IPageProps {
    opened: boolean;
    actionId?: number;
    onSuccess: () => void;
    onClose: () => void;
}

const createFormSchema = yup.object().shape({
    name: yup.string()
        .required('กรุณาระบุชื่อ'),

    email: yup.string()
        .required('กรุณาระบุอีเมล')
        .email('กรุณาระบุอีเมลให้ถูกต้อง'),

    password: yup.string()
        .required('กรุณาระบุรหัสผ่าน')
        .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),

    passwordConfirmation: yup.string()
        .required('กรุณายืนยันรหัสผ่าน')
        .oneOf([yup.ref('password')], 'รหัสผ่านไม่ตรงกัน')
});

const updateFormSchema = yup.object().shape({
    name: yup.string()
        .required('กรุณาระบุชื่อ'),

    email: yup.string()
        .required('กรุณาระบุอีเมล')
        .email('กรุณาระบุอีเมลให้ถูกต้อง'),
});

const initialAssetForm: IUserForm = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: ""
};

const UserForm: React.FC<IPageProps> = ({ opened, actionId, onSuccess, onClose }) => {
    const { loading, createUser, updateUser, getUserById } = useUser();

    const form = useForm<IUserForm>({
        mode: 'uncontrolled',
        initialValues: initialAssetForm,
        validate: yupResolver(actionId ? updateFormSchema : createFormSchema),
    });

    const handleSubmit = async (values: IUserForm) => {
        let isSuccess = false;
        let message = "เพิ่มผู้ใช้สำเร็จ";

        if (actionId) {
            isSuccess = await updateUser(actionId, values);
            message = "แก้ไขผู้ใช้สำเร็จ";
        } else {
            isSuccess = await createUser(values);
        }

        if (isSuccess) {
            handleSuccess(message);
            onSuccess();
            handleCloseDialog();
        }
    };

    const handleCloseDialog = () => {
        form.setInitialValues(initialAssetForm);
        form.reset();
        onClose();
    };

    useEffect(() => {
        const initData = async () => {
            if (actionId && opened) {
                const response = await getUserById(actionId);

                if (response) {
                    form.setInitialValues({
                        name: response.name,
                        email: response.email,
                        password: "",
                        passwordConfirmation: ""
                    });
                    form.reset();
                }
            }
        };

        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId]);

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleCloseDialog}
                title={actionId ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
                closeOnClickOutside={false}
                centered
                size={"md"}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Box pos={"relative"}>
                        <LoadingOverlay
                            visible={loading}
                            loaderProps={{ children: <Loader size={50} /> }}
                        />

                        <TextInput
                            label="ชื่อ"
                            description=""
                            mb={{ base: "xs", md: "md" }}
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            label="อีเมล"
                            description=""
                            mb={{ base: "xs", md: "md" }}
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />

                        {!actionId && (
                            <>
                                <PasswordInput
                                    label="รหัสผ่าน"
                                    description=""
                                    mb={{ base: "xs", md: "md" }}
                                    key={form.key('password')}
                                    {...form.getInputProps('password')}
                                />

                                <PasswordInput
                                    label="ยืนยันรหัสผ่าน"
                                    description=""
                                    mb={{ base: "xs", md: "md" }}
                                    key={form.key('passwordConfirmation')}
                                    {...form.getInputProps('passwordConfirmation')}
                                />
                            </>
                        )}

                        <Flex direction={"row"} justify={"space-between"} mt={"md"}>
                            <Button variant="light" color="gray" onClick={() => handleCloseDialog()}>ยกเลิก</Button>
                            <Button type="submit" variant="filled">ยืนยัน</Button>
                        </Flex>
                    </Box>
                </form>
            </Modal>
        </>
    );
};

export default UserForm;