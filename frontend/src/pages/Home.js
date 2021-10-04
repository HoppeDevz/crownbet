import React, { useState, useEffect } from 'react';

/**
 * 
 * @Styles
 */
import './Home.css';

/**
 * 
 * @Components
 */
import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import CrashGame from '../components/CrashGame';
import Footer from '../components/Footer';
import NotifyArea from '../components/NotifyArea';

/**
* 
* @Providers
*/
import { GlobalProvider } from '../providers/global';

function Home() {

    const[headerLoaded, setHeaderLoaded] = useState(false);

    const[gameSelected, setGameSelected] = useState(0);

    return(
        <React.Fragment>

            <GlobalProvider>

                {!headerLoaded ? <LoadingScreen type="show" /> : <LoadingScreen type="hidden" />}

                {headerLoaded ?
                    <NotifyArea />
                :null}

                <Header
                    onChangeGame={setGameSelected}
                    gameSelected={gameSelected}
                    onComponentLoaded={() => setTimeout(() => setHeaderLoaded(true), 2500)}
                />


                {gameSelected == 0 && headerLoaded ? 
                    <CrashGame />
                :null}

                {gameSelected == 1 && headerLoaded ? <div>Roleta</div> : null}
                {gameSelected == 2 && headerLoaded ? <div>Coinflip</div> : null}

                {headerLoaded ? <Footer /> : null}

            </GlobalProvider>
            
        </React.Fragment>
    )
}

export default Home;