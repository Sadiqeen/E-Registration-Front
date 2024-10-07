import { PATH } from "@/constant/path";
import AuthLayout from "@/layout/AuthLayout";
import Course from "@/pages/Course/Course";
import Login from "@/pages/Login/Login";
import User from "@/pages/User/User";
import { createBrowserRouter, redirect } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: PATH.INDEX,
        loader: async () => redirect(PATH.LOGIN)
    },
    
    {
        path: PATH.LOGIN,
        element: <Login />,
    },

    {
        element: <AuthLayout />,
        children: [
            {
                path: PATH.USER_MANAGEMENT,
                element: <User />,
            },

            {
                path: PATH.COURSE_MANAGEMENT,
                element: <Course />,
            },
        ]
    }
]);