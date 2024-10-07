import useCourse from "@/hook/useCourse";
import { ICourseForm } from "@/interface/course";
import { handleSuccess } from "@/utils/helper";
import { Box, Button, Flex, Loader, LoadingOverlay, Modal, SimpleGrid, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates';
import * as yup from 'yup';
import 'dayjs/locale/th';
import { useEffect, useState } from "react";
import { convertIsoToDate } from "@/utils/dateUtils";

interface IPageProps {
    opened: boolean;
    actionId?: number;
    onSuccess: () => void;
    onClose: () => void;
}

const schema = yup.object().shape({
    name: yup.string()
        .required('กรุณาระบุชื่อหลักสูตร')
        .max(100, 'กรุณาระบุชื่อหลักสูตรไม่เกิน 100 ตัวอักษร'),

    description: yup.string()
        .required('กรุณาระบุคำอธิบายหลักสูตร')
        .max(500, 'กรุณาระบุคำอธิบายหลักสูตรไม่เกิน 500 ตัวอักษร'),

    enrollmentStart: yup.date()
        .required('กรุณาระบุวันที่เริ่มการลงทะเบียน')
        .typeError('กรุณาระบุวันที่เริ่มการลงทะเบียนให้ถูกต้อง'),

    enrollmentEnd: yup.date()
        .required('กรุณาระบุวันที่สิ้นสุดการลงทะเบียน')
        .typeError('กรุณาระบุวันที่สิ้นสุดการลงทะเบียนให้ถูกต้อง')
        .test('is-greater', 'กรุณาระบุวันที่สิ้นสุดการลงทะเบียนให้หลังจากวันที่เริ่มการลงทะเบียน',
            function (value) {
                const { enrollmentStart } = this.parent;
                return value > enrollmentStart;
            }),

    teachingStart: yup.date()
        .required('กรุณาระบุวันที่เริ่มสอน')
        .typeError('กรุณาระบุวันที่เริ่มสอนให้ถูกต้อง')
        .test('is-after-enrollmentEnd', 'กรุณาระบุวันที่เริ่มสอนให้หลังจากวันที่สิ้นสุดการลงทะเบียน',
            function (value) {
                const { enrollmentEnd } = this.parent;
                return value > enrollmentEnd;
            }),

    teachingEnd: yup.date()
        .required('กรุณาระบุวันที่สิ้นสุดการสอน')
        .typeError('กรุณาระบุวันที่สิ้นสุดการสอนให้ถูกต้อง')
        .test('is-after-teachingStart', 'กรุณาระบุวันที่สิ้นสุดการสอนให้หลังจากวันที่เริ่มสอน',
            function (value) {
                const { teachingStart } = this.parent;
                return value > teachingStart;
            })
});

const initialAssetForm: ICourseForm = {
    name: "",
    description: "",
    enrollmentStart: new Date,
    enrollmentEnd: new Date,
    teachingStart: new Date,
    teachingEnd: new Date,
};

const CourseForm: React.FC<IPageProps> = ({ opened, actionId, onSuccess, onClose }) => {
    const { loading, createCourse, updateCourse, getCourseById } = useCourse();
    const [minEnrollEnd, SetMinEnrollEnd] = useState<Date>(new Date);
    const [minTeachingEnd, SetMinTeachingEnd] = useState<Date>(new Date);

    const form = useForm<ICourseForm>({
        mode: 'uncontrolled',
        initialValues: initialAssetForm,
        validate: yupResolver(schema),
    });

    const handleSubmit = async (values: ICourseForm) => {
        let isSuccess = false;
        let message = "เพิ่มหลักสูตรสำเร็จ";

        if (actionId) {
            isSuccess = await updateCourse(actionId, values);
            message = "แก้ไขหลักสูตรสำเร็จ";
        } else {
            isSuccess = await createCourse(values);
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

    form.watch('enrollmentStart', ({ value }) => {
        SetMinEnrollEnd(value);
        const currentValue = form.getValues();
        if (currentValue.enrollmentEnd < value) {
            form.setValues({ enrollmentEnd: value });
        }
    });

    form.watch('teachingStart', ({ value }) => {
        SetMinTeachingEnd(value);
        const currentValue = form.getValues();
        if (currentValue.teachingEnd < value) {
            form.setValues({ teachingEnd: value });
        }
    });

    useEffect(() => {
        const initData = async () => {
            if (actionId && opened) {
                const response = await getCourseById(actionId);

                if (response) {
                    form.setInitialValues({
                        name: response.name,
                        description: response.description,
                        enrollmentStart: convertIsoToDate(response.enrollmentStart.toString()),
                        enrollmentEnd: convertIsoToDate(response.enrollmentEnd.toString()),
                        teachingStart: convertIsoToDate(response.teachingStart.toString()),
                        teachingEnd: convertIsoToDate(response.teachingEnd.toString()),
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
                title={actionId ? "แก้ไขหลักสูตร" : "เพิ่มหลักสูตร"}
                closeOnClickOutside={false}
                centered
                size={"xl"}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Box pos={"relative"}>
                        <LoadingOverlay
                            visible={loading}
                            loaderProps={{ children: <Loader size={50} /> }}
                        />

                        <TextInput
                            label="ชื่อหลักสูตร"
                            description=""
                            mb={{ base: "xs", md: "md" }}
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />

                        <Textarea
                            label="คำอธิบาย"
                            description=""
                            resize="vertical"
                            mb={{ base: "xs", md: "md" }}
                            autosize
                            minRows={5}
                            key={form.key('description')}
                            {...form.getInputProps('description')}
                        />

                        <SimpleGrid cols={{ base: 1, md: 2 }}>

                            <DatePickerInput
                                minDate={new Date}
                                locale="th"
                                valueFormat="DD MMMM YYYY"
                                label="วันที่เริ่มการลงทะเบียน"
                                placeholder=""
                                mb={{ base: "xs", md: "md" }}
                                key={form.key('enrollmentStart')}
                                {...form.getInputProps('enrollmentStart')}
                            />

                            <DatePickerInput
                                minDate={minEnrollEnd}
                                locale="th"
                                valueFormat="DD MMMM YYYY"
                                label="วันที่สิ้นสุดการลงทะเบียน"
                                placeholder=""
                                mb={{ base: "xs", md: "md" }}
                                key={form.key('enrollmentEnd')}
                                {...form.getInputProps('enrollmentEnd')}
                            />

                            <DatePickerInput
                                minDate={minEnrollEnd}
                                locale="th"
                                valueFormat="DD MMMM YYYY"
                                label="วันที่เริ่มสอน"
                                placeholder=""
                                mb={{ base: "xs", md: "md" }}
                                key={form.key('teachingStart')}
                                {...form.getInputProps('teachingStart')}
                            />

                            <DatePickerInput
                                minDate={minTeachingEnd}
                                locale="th"
                                valueFormat="DD MMMM YYYY"
                                label="วันที่สิ้นสุดการสอน"
                                placeholder=""
                                mb={{ base: "xs", md: "md" }}
                                key={form.key('teachingEnd')}
                                {...form.getInputProps('teachingEnd')}
                            />

                        </SimpleGrid>

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

export default CourseForm;