import { RootState } from '@/store';
import { Burger, Button, Group, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import classes from './navbar.module.css';

interface IPageProps {
    mobileOpened: boolean;
    toggleMobile: () => void;
}

const Navbar: React.FC<IPageProps> = ({ mobileOpened, toggleMobile }) => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={mobileOpened} onClick={toggleMobile} size="md" hiddenFrom="sm" />
                    <Text visibleFrom="sm" fw={600} size="lg">E-Registration</Text>
                </Group>

                <Group>
                    <Button variant="gradient">{user?.name}</Button>
                </Group>
            </div>
        </header>
    );
};

export default Navbar;