import React, { useState, useEffect } from 'react';

/**
 * @Config
 */
import CONFIG from '../config/index';

/**
 * @Components
 */
import AccountModal from '../components/AccountModal';

/**
 * 
 * @Styles
 */
import './Header.css';

function Header() {

    const[showAccountModal, setShowAccountModal] = useState(false);

    return(
        <>
            {
            showAccountModal ?
                <AccountModal />
            : null
            }

            <div className="header-wrapper">
                
                <div className="left-container">
                    
                    <h1>
                        {CONFIG.PROJECT_NAME}.<span>{CONFIG.PROJECT_SUBNAME}</span>
                    </h1>
                </div>

                <div className="right-container">

                    <div className="games-area">

                        <button className="game-btn">ROLETA</button>
                        <button className="game-btn">COINFLIP</button>
                        <button className="game-btn">CRASH</button>
                    </div>

                    <div className="user-area">

                        <button onClick={() => setShowAccountModal(true)} className="login-btn">LOGIN</button>
                        <button onClick={() => setShowAccountModal(true)} className="register-btn">CADASTRAR-SE</button>
                    </div>
                </div>

                <div className="cellphone-menu">

                    <button>Click here</button>
                </div>
            </div>
        </>
    )
}

export default Header;