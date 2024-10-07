
import { AppShell, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PropsWithChildren, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { PATH } from '@/constant/path';
import SideBar from '@/component/Sidebar/Sidebar';
import Navbar from '@/component/Navbar/Navbar';

type IPageProps = PropsWithChildren;

const AuthLayout: React.FC<IPageProps> = () => {
    const navigate = useNavigate();
    const [mobileOpened, { toggle: toggleMobile, close }] = useDisclosure();
    const theme = useMantineTheme();

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(PATH.LOGIN);
        }
    }, [isLoggedIn, navigate]);

    return (
        <AppShell
            header={{ height: rem(56) }}
            navbar={{
                width: rem(300),
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Navbar
                    mobileOpened={mobileOpened}
                    toggleMobile={toggleMobile}
                    />
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <SideBar closeSideBar={close} />
            </AppShell.Navbar>

            <AppShell.Main style={{ backgroundColor: theme.colors.gray[1] }}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default AuthLayout;