import ConfirmDeleteModal from "@/component/ConfirmDeleteModal/ConfirmDeleteModal";
import useCourse from "@/hook/useCourse";
import { ICourse } from "@/interface/course";
import { PaginationResponse } from "@/interface/pagination";
import CourseForm from "@/pages/Course/CourseForm";
import { courseApi } from "@/utils/api";
import { formatDateToThai } from "@/utils/dateUtils";
import { handleError, handleSuccess } from "@/utils/helper";
import { ActionIcon, Box, Button, Flex, Input, Menu, Paper, rem } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconSearch, IconSettings, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";

const Course: React.FC = () => {
    const [formOpened, { close: closeForm, open: openForm }] = useDisclosure(false);
    const [deleteModalOpened, { close: closeDeleteModal, open: openDeleteModal }] = useDisclosure(false);

    const [actionId, setActionId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [debounced] = useDebouncedValue(searchInput, 500);
    const { deleteCourse, loading: processingDelete } = useCourse();
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 50,
        total: 0
    });

    const getCourse = async (controller?: AbortController) => {
        setIsLoading(true);
        const abortController = controller || new AbortController();

        try {

            const params = {
                page: pagination.page,
                pageSize: pagination.pageSize,
                search: debounced
            };

            const response = await courseApi.get<PaginationResponse<ICourse>>("course", {
                params,
                signal: abortController.signal
            });

            setCourses(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            if (abortController.signal.aborted) {
                console.log('Asset index request was canceled');
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitFromSuccess = () => {
        getCourse();
        handleCloseForm();
    };

    const handleCloseForm = () => {
        setActionId(undefined);
        closeForm();
    };

    const handleConfirmDelete = async () => {
        if (actionId) {
            const response = await deleteCourse(actionId);
            setActionId(undefined);
            closeDeleteModal();
            if (response) {
                handleSuccess("ลบข้อมูลสำเร็จ");
                await getCourse();
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getCourse(controller);

        return () => {
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced, pagination.page, pagination.pageSize]);

    return (
        <>
            <Box my="md">
                <Paper shadow="lg" p="md" radius="md">
                    <Flex
                        mb={"md"}
                        justify={"space-between"}
                        gap={{ base: "xs", sm: "md" }}
                        direction={{ base: "column", sm: "row" }}
                    >
                        <Button leftSection={<IconPlus size={20} />} onClick={() => openForm()} disabled={isLoading}>
                            เพิ่มหลักสูตร
                        </Button>

                        <Flex gap={{ base: "xs", sm: "md" }} direction={{ base: "column", sm: "row" }}>
                            <Input
                                placeholder="ค้นหา"
                                value={searchInput}
                                disabled={isLoading}
                                rightSection={<IconSearch size={20} />}
                                onChange={(event) => setSearchInput(event.currentTarget.value.trim())}
                            />
                        </Flex>
                    </Flex>

                    <DataTable
                        striped
                        verticalSpacing="sm"
                        withColumnBorders
                        highlightOnHover
                        pinLastColumn
                        minHeight={200}
                        totalRecords={pagination.total}
                        recordsPerPage={pagination.pageSize}
                        page={pagination.page}
                        onPageChange={page => {
                            setPagination(prev => ({
                                ...prev,
                                page
                            }));
                        }}
                        fetching={isLoading}
                        records={courses}
                        columns={[
                            {
                                accessor: 'id',
                                title: '#',
                                width: 80,
                                textAlign: "center",
                                render: (record, index) => (
                                    (pagination.page - 1) * pagination.pageSize + index + 1
                                ),
                            },
                            {
                                accessor: 'name',
                                title: 'ชื่อหลักสูตร',
                            },
                            {
                                accessor: 'description',
                                title: 'คำอธิบาย',
                            },
                            {
                                accessor: 'enrollmentStart',
                                title: 'วันที่เริ่มการลงทะเบียน',
                                render: (record) => formatDateToThai(record.enrollmentStart)
                            },
                            {
                                accessor: 'enrollmentEnd',
                                title: 'วันที่สิ้นสุดการลงทะเบียน',
                                render: (record) => formatDateToThai(record.enrollmentEnd)
                            },
                            {
                                accessor: 'actions',
                                title: '##',
                                textAlign: 'center',
                                cellsClassName: 'bg-white',
                                titleClassName: 'bg-white',
                                width: 60,
                                render: (record) => (
                                    <Menu shadow="md" position="bottom-end" width={170}>
                                        <Menu.Target>
                                            <ActionIcon variant="filled" aria-label="Settings">
                                                <IconSettings style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                                onClick={() => {
                                                    setActionId(record.id);
                                                    openForm();
                                                }}
                                            >
                                                แก้ไข
                                            </Menu.Item>

                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                                onClick={() => {
                                                    setActionId(record.id);
                                                    openDeleteModal();
                                                }}
                                            >
                                                ลบ
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                ),
                            },
                        ]}
                    />
                </Paper>
            </Box>

            <CourseForm
                opened={formOpened}
                actionId={actionId}
                onClose={handleCloseForm}
                onSuccess={handleSubmitFromSuccess}
            />

            <ConfirmDeleteModal
                isLoading={processingDelete}
                opened={deleteModalOpened}
                close={() => {
                    setActionId(undefined);
                    closeDeleteModal();
                }}
                onConfirm={() => handleConfirmDelete()}
            />
        </>
    );
};

export default Course;