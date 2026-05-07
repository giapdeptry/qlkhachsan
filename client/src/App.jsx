import { useEffect } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import ChatBot from './utils/ChatBot';

function App() {
    useEffect(() => {
        document.title = 'Trang chủ';
    }, []);

    return (
        <div>
            <header>
                <Header />
            </header>
            <main>
                <Banner />

                <div className="container mx-auto">
                    <HomePage />
                </div>
            </main>

            <ChatBot />

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;
