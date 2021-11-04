import React from 'react';
import { HomePage } from '../modules/home/HomePage';

import { PageLayout } from '../layout/PageLayout';
import { Visualizer } from '../modules/home/Visualizer';

export default function Home() {


    return (
        <PageLayout className="flex-row">
            <HomePage />
            <Visualizer />
        </PageLayout>
    );
}

