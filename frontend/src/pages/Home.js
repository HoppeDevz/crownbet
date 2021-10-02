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

function Home() {

    const[headerLoaded, setHeaderLoaded] = useState(false);

    return(
        <React.Fragment>
            {!headerLoaded ? <LoadingScreen type="show" /> : <LoadingScreen type="hidden" />}

            <Header onComponentLoaded={() => setHeaderLoaded(true)} />
            
        </React.Fragment>
    )
}

export default Home;