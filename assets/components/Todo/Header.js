import {Circles} from "react-loader-spinner";
import Alert from "@mui/material/Alert";
import React from "react";

const Header = (props) => {
    return (<>
            {props.isLoading && <Circles
                height="80"
                width="80"
                radius="9"
                wrapperClass="custom_spinner"
                color="#2771cb"
                ariaLabel="three-dots-loading"
            />}

            {props.error && <Alert severity="error" onClose={() => {
                props.error = false;
                // setError(null)
            }}>{props.error}</Alert>}
        </>
    );
};
export default Header;


