import React from "react";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "../../recoil/atom/loadingAtom";
import Loading from "./loading/Loading";
import Header from "./header/Header";
import Footer from "./footer/Footer";

interface LayoutProps{
    children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
    const loading = useRecoilValue(loadingAtom);

    return(
        <div>
            {loading>0 && <Loading/>}
            <Header/>
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout