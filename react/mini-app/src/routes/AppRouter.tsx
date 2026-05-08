import React from "react";
import {Route, Routes} from "react-router-dom";
import HomeRouter from "./home/HomeRouter";
import LoginRouter from "./auth/LoginRouter";
import ManagerRouter from "./manager/ManagerRouter";
import SignupRouter from "./auth/SignupRouter";

export const AppRouter = () => {
    return(
        <div>
            <Routes>
                <Route path='/' element={<HomeRouter/>}/>
                <Route path='/login' element={<LoginRouter/>}/>
                <Route path='/signup' element={<SignupRouter/>}/> 
                <Route path='/manager' element={<ManagerRouter/>}/>
            </Routes>
        </div>
    )
}