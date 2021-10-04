import React, { useState } from 'react';

export const GlobalContext = React.createContext({});

export const GlobalProvider = (props) => {

    const[userBalance, setUserBalance] = useState(0.0);

    const[notifyId, setNotifyId] = useState(0);
    
    function addNotify(message, type, interval) {

        const id = notifyId;
        setNotifyId(notifyId + 1);

        const notifyContainer = document.querySelector(".notify-container");

        notifyContainer.insertAdjacentHTML("beforeend", `
            <div id="alert-${id}" class="notify-${type}">
                ${message}
            </div>
        `)

        setTimeout(() => {

            const alert = document.querySelector(`#alert-${id}`);
            alert.remove();

        }, interval * 1000);
    }

    return(
        <GlobalContext.Provider value={{userBalance, setUserBalance, addNotify}}>
            {props.children}
        </GlobalContext.Provider>
    )
}