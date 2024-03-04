import React from "react";
import SiteHeader from "./SiteHeader";

import { Skeleton } from "antd";

const SitePageLoading = () => {
    return (
        <>
            <SiteHeader />
            <div style={{ padding: "24px", background: "white" }}>
                <Skeleton title={false} active={true} />
            </div>
        </>
    );
};

export default SitePageLoading;
