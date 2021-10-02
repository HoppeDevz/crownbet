import React, { useState, useEffect } from 'react';

/**
* @Styles 
*/
import './LoadingScreen.css';

/**
 * @Config
*/
import config from '../config';

/**
 * @Media
*/
import LoadingAnim from '../assets/loading-anim.gif';

function LoadingScreen(props) {
    
    const[ready, setReady] = useState(false);
    const[minLoadingTime, setMinLoadingTime] = useState(2 * 1000);

    useEffect(() => {

        setTimeout(() => setReady(true), minLoadingTime);
    }, [ setReady ])

    return(
        <div className={props.type == "show" ? "loading-screen-wrapper" : props.type == "hidden" && ready ? "loading-screen-wrapper hidden" : "loading-screen-wrapper" }>

            <div className="center">
                <h1>{config.PROJECT_NAME}.<span>{config.PROJECT_SUBNAME}</span></h1>

                <img width="100px" src={LoadingAnim} />
            </div>
            
        </div>
    )
}

export default LoadingScreen;