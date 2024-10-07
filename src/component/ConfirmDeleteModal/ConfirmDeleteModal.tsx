import { Modal, Flex, Button, Text } from "@mantine/core";
import { ReactNode } from "react";

interface IPageProps {
    title?: string;
    description?: ReactNode;
    opened: boolean;
    close: () => void;
    isLoading: boolean;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<IPageProps> = ({ opened, close, title, description, isLoading, onConfirm }) => {
    const handleCloseDialog = () => {
        if (!isLoading) {
            close();
        }
    };

    return (
        <Modal opened={opened} onClose={handleCloseDialog} title={title ?? "ยืนยันการลบ"} closeOnClickOutside={false} centered>
            {description && description}
            {!description && <Text c="gray" size="sm">กรุณาตรวจสอบข้อมูลก่อนทำการยืนยันการลบข้อมูล<br />การกระทำนี้ไม่สามารถย้อนกลับได้</Text>}

            <Flex justify={"space-between"} mt={"md"}>
                <Button size="xs" variant="light" color="gray" disabled={isLoading} onClick={() => handleCloseDialog()}>ยกเลิก</Button>
                <Button size="xs" variant="filled" color="red" loading={isLoading} onClick={() => onConfirm()}>ยืนยัน</Button>
            </Flex>

        </Modal>
    );
};

export default ConfirmDeleteModal;