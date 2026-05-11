import React from "react";
import {Route, Routes} from "react-router-dom";
import HomeRouter from "./home/HomeRouter";
import LoginRouter from "./auth/LoginRouter";
import ManagerRouter from "./manager/ManagerRouter";
import SignupRouter from "./auth/SignupRouter";
import Layout from "../component/layout/Layout";

export const AppRouter = () => {
    return(
        <div>
            <Routes>
                <Route path='/' element={
                    <Layout>
                        <HomeRouter/>
                    </Layout>
                }/>
                <Route path='/login' element={<LoginRouter/>}/>
                <Route path='/signup' element={<SignupRouter/>}/> 
                <Route path='/manager' element={
                    <Layout>
                        <ManagerRouter/>
                    </Layout>
                }/>
            </Routes>
        </div>
    )
}