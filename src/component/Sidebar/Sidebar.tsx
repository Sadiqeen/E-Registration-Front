import { PATH } from '@/constant/path';
import { logout } from '@/reducers/authReducer';
import {
    Icon,
    IconBooks,
    IconLogout,
    IconProps,
    IconUsers
} from '@tabler/icons-react';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classes from './sidebar.module.css';

interface IMenu {
    link: string;
    label: string;
    active: string[];
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    subMenu?: IMenu[];
}

interface IPageProps {
    closeSideBar: () => void;
}

const mainMenu: IMenu[] = [
    {
        link: PATH.COURSE_MANAGEMENT,
        label: 'จัดการหลักสูตร',
        icon: IconBooks,
        active: [
            PATH.COURSE_MANAGEMENT
        ]
    },
];

const bottomMenu: IMenu[] = [
    {
        link: PATH.USER_MANAGEMENT,
        label: 'จัดการผู้ใช้',
        icon: IconUsers,
        active: [
            PATH.USER_MANAGEMENT
        ]
    },
];

const SideBar: React.FC<IPageProps> = ({ closeSideBar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState<string>(location.pathname.replace(/\d+/g, ':id'));

    const renderMenu = (menus: IMenu[]): ReactNode => {
        return menus.map((item, index) => (
            <Link
                className={classes.link}
                data-active={item.active.includes(active) || undefined}
                to={item.link}
                key={index}
                onClick={() => {
                    closeSideBar();
                    setActive(item.link);
                }}
            >
                {item.icon && <item.icon className={classes.linkIcon} stroke={1.5} />}
                <span>{item.label}</span>
            </Link>
        ));
    };

    const handleLogout = () => {
        dispatch(logout());

        return navigate(PATH.LOGIN);
    };

    useEffect(() => {
        setActive(location.pathname.replace(/\d+/g, ':id'));
    }, [location.pathname])

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                {renderMenu(mainMenu)}
            </div>

            <div className={classes.footer}>
                {renderMenu(bottomMenu)}

                <a href="#" className={classes.link} onClick={() => handleLogout()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>ออกจากระบบ</span>
                </a>
            </div>
        </nav>
    );
};

export default SideBar;