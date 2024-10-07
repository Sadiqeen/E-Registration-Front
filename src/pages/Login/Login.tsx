import { PATH } from '@/constant/path';
import useAuthentication from '@/hook/useAuthentication';
import { RootState } from '@/store';
import {
    Button,
    Flex,
    Paper,
    PasswordInput,
    TextInput,
    Title
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import classes from './login.module.css';

const schema = yup.object().shape({
    email: yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required("กรุณากรอกอีเมล"),
    password: yup.string()
        .required("กรุณากรอกรหัสผ่าน"),
});

interface ILoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuthentication();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const form = useForm<ILoginForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
        validate: yupResolver(schema),
    });

    const attemptLogin = async (values: ILoginForm) => {
        if (await login(values.email, values.password)) {
            navigate(PATH.COURSE_MANAGEMENT);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate(PATH.COURSE_MANAGEMENT);
        }
    },[isLoggedIn, navigate])

    return (
        <div className={classes.wrapper}>
            <form onSubmit={form.onSubmit((values) => attemptLogin(values))}>
                <Paper className={classes.form} radius={0} p={30}>
                    <Flex direction={"column"} h={"100%"} justify={"center"}>
                        <Title order={3} className={classes.title} ta="center" mt="md" mb={30}>
                            ยินดีต้อนรับเข้าสู่ระบบ E-Register!
                        </Title>

                        <TextInput
                            label="อีเมล"
                            placeholder="hello@gmail.com"
                            size="md"
                            type='email'
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            label="รหัสผ่าน"
                            placeholder="Your password"
                            mt="md"
                            size="md"
                            {...form.getInputProps('password')}
                        />

                        <Button fullWidth mt="xl" size="md" type='submit' loading={loading}>
                            เข้าสู่ระบบ
                        </Button>
                    </Flex>
                </Paper>
            </form>
        </div>
    );
};

export default Login;