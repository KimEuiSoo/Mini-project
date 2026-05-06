import React from "react";
import {Route, Routes} from "react-router-dom";
import HomeRouter from "./home/HomeRouter";
import LoginRouter from "./auth/LoginRouter";

export const AppRouter = () => {
    return(
        <div>
            <Routes>
                <Route path='/' element={<HomeRouter/>}/>
                <Route path='/login' element={<LoginRouter/>}/>
            </Routes>
        </div>
    )
}