import React, { CSSProperties } from "react";
import { PulseLoader } from "react-spinners";

const Loading = () => {
    const overlayStyle: CSSProperties = {
        position: "fixed",
        inset: 0,
        zIndex: 999999,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(0, 0, 0, 0.45)",
        pointerEvents: "all",
    };

    const contentStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
    };

    return (
        <div style={overlayStyle}>
            <div style={contentStyle}>
                <PulseLoader
                    color="#ffffff"
                    loading={true}
                    size={12}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />

                <p
                    style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: 600,
                    }}
                >
                    로딩 중...
                </p>
            </div>
        </div>
    );
};

export default Loading;