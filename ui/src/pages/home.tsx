import React from 'react';
import { HomePage } from '../modules/home/HomePage';

import { PageLayout } from '../layout/PageLayout';

export default function Home() {


    return (
        <PageLayout className="flex-row">
            <HomePage />
        </PageLayout>
    );
}

