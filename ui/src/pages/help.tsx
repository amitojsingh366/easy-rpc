import React from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "../layout/PageLayout";

export default function Help() {
    return (
        <PageLayout>
            Help!
            <Link to="/">Go Back</Link>
        </PageLayout>
    );
}