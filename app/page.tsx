import React from 'react';
import HeroSection from '../components/HeroSection';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

const App = () => {
    return (
        <div>
            <main>
                <HeroSection />
                <ContentSection />
            </main>
            <Footer />
        </div>
    );
};

export default App;