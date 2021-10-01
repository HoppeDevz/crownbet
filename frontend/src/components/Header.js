import React, { useState, useEffect } from 'react';

/**
 * 
 * @Styles
 */
import './Header.css';

function Header() {

    return(
        <div className="header-wrapper">
            
            <div className="left-container">
                
                <h1>
                    CROWN.<span>BET</span>
                </h1>
            </div>

            <div className="right-container">

                <div className="games-area">

                    <button className="game-btn">ROLETA</button>
                    <button className="game-btn">COINFLIP</button>
                    <button className="game-btn">CRASH</button>
                </div>

                <div className="user-area">

                    <button className="login-btn">LOGIN</button>
                    <button className="register-btn">CADASTRAR-SE</button>
                </div>
            </div>

            <div className="cellphone-menu">

                <button>Click here</button>
            </div>
        </div>
    )
}

export default Header;