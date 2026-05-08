import React, {CSSProperties, useState} from "react";
import { PulseLoader } from "react-spinners";

const Loading = () => {
    const [loading, setLoading] = useState(true);

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
        
    };

    return(
        <PulseLoader
            color="#000"
            loading={loading}
            cssOverride={override}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"/>
    )
}

export default Loading