import React from "react";
import {Route, Routes} from "react-router-dom";
import HomeRouter from "./home/HomeRouter";

export const AppRouter = () => {
    return(
        <div>
            <Routes>
                <Route path='/' element={<HomeRouter/>}/>
            </Routes>
        </div>
    )
}