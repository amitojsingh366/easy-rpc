import React from 'react';
import { HomePage } from '../modules/home/HomePage';
import { PageLayout } from '../layout/PageLayout';
import { Visualizer } from '../modules/home/Visualizer';
import { VisualizerProvider } from '../modules/home/VisualizerProvider';

export default function Home() {
    return (
        <VisualizerProvider >
            <PageLayout className="flex-row">
                <HomePage />
                <Visualizer />
            </PageLayout>
        </VisualizerProvider>
    );
}

