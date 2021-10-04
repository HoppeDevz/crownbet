import React, { useState, useEffect } from 'react';

/**
* @Lib
*/
import currency from '../lib/currency';
import { LogOut } from 'react-feather';

/**
* @Styles 
*/
import './CellphoneMenu.css';

function CellphoneMenu(props) {

    return(
        <>
            <div className="cellphone-menu">

                
                {props.logged ? 
                    <div className="user-balance">
                        <p>{currency.formatCurrency(props.userBalance)}</p>
                        <LogOut onClick={props.onLogoutHandler} size={20} color="#e9b10e" />
                    </div>
                : 
                    <div className="user-area">
                        <button onClick={props.onLoginHandler} className="login-btn">ENTRAR</button>
                        <button onClick={props.onRegisterHandler} className="register-btn">REGISTRAR</button>
                    </div>
                }

                <div className="games-area">
                    <button onClick={() => props.onChangeGame(0)} className={props.gameSelected == 0 ? "game-btn selected" : "game-btn"}>CRASH</button>
                    <button onClick={() => props.onChangeGame(1)} className={props.gameSelected == 1 ? "game-btn selected" : "game-btn"}>ROLETA</button>
                    <button onClick={() => props.onChangeGame(2)} className={props.gameSelected == 2 ? "game-btn selected" : "game-btn"}>COINFLIP</button>
                </div>

                {props.logged ? 
                    <div className="balance-controls">
                        <button className="deposit">DEPOSITAR</button>
                        <button className="withdraw">SACAR</button>
                    </div>
                :null}
            
            </div>

            <div className="cellphone-menu-background">
                
            </div>
        </>
    )
}

export default CellphoneMenu;