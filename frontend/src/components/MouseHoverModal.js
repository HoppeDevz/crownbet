import React, { useEffect, useState } from 'react';

/**
* @Styles
*/
import './MouseHoverModal.css';

function MouseHoverModal(props) {

    const[posX, setPosX] = useState(0.0);
    const[posY, setPosY] = useState(0.0);
    
    useEffect(() => {

        function Listener(event) {

            const { screenX, screenY } = event;
            
            setPosX(screenX);
            setPosY(screenY);
        }
        window.addEventListener("mousemove", Listener);


        return () => window.removeEventListener("mousemove", Listener);

    }, [ setPosX, setPosY ]);

    return(
        <div style={{
            display: props.activeModal ? "flex" : "none",
            top: posY - 110,
            left: posX


        }} className="mouse-hover-modal-wrapper">
            {props.content}
        </div>
    )
}

export default MouseHoverModal;