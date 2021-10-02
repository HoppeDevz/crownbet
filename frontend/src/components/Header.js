import React, { useState, useEffect } from 'react';

/**
* @Lib
*/
import currency from '../lib/currency';
import { AlignJustify, LogOut } from 'react-feather';

/**
 * @Config
 */
import CONFIG from '../config/index';

/**
 * @Components
 */
import AccountModal from '../components/AccountModal';
import CellphoneMenu from './CellphoneMenu';

/**
 * 
 * @Styles
 */
import './Header.css';
import api from '../lib/api';

function Header(props) {

    const[showAccountModal, setShowAccountModal] = useState(false);
    const[showCellphoneMenu, setShowCellPhoneMenu] = useState(false);

    const[logged, setLogged] = useState(false);
    const[userBalance, setUserBalance] = useState(0.0);

    function onLogin(token) {

        api.get("/get_user_balance", {
            headers: {
                authorization: `Baerer ${token}`
            }
        })
        .then(response => {

            setUserBalance(response.data.balance);
            setShowAccountModal(false);
            setLogged(true);
        })
        .catch(err => {

            localStorage.clear();
            setLogged(false);
        })
    }

    function logoutHandler() {

        localStorage.clear();
        setLogged(false);
    }

    function toogleCellPhoneMenu() {
        
        setShowCellPhoneMenu(!showCellphoneMenu);
    }

    // onUserEnter
    useEffect(() => {

        const token = localStorage.getItem("x-user-token");

        console.log(token);

        if (!token) return props.onComponentLoaded();

        api.get("/get_user_balance", {
            headers: {
                authorization: `Baerer ${token}`
            }
        })
        .then(response => {

            setUserBalance(response.data.balance);
            setShowAccountModal(false);
            setLogged(true);

            props.onComponentLoaded();
        })
        .catch(err => {

            localStorage.clear();
            setLogged(false);

            props.onComponentLoaded();
        })

    }, [ setLogged, setUserBalance ])

    return(
        <>
            {
            showAccountModal ?
                <AccountModal onCloseModalHandle={() => setShowAccountModal(false)} onLoginHandler={onLogin} />
            : null
            }

            {showCellphoneMenu ?
                <CellphoneMenu 
                    onLoginHandler={() => setShowAccountModal(true)}
                    onRegisterHandler={() => setShowAccountModal(true)}
                    onLogoutHandler={() => logoutHandler()}
                    logged={logged} 
                    userBalance={userBalance}
                />
            :null}

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

                    {logged ?
                        <div className="logged-user-area">

                            <div className="balance">
                                <p className="balance-label" >SALDO:</p>
                                <p className="balance-value">{currency.formatCurrency(userBalance)}</p>
                            </div>

                            <div className="balance-actions">
                                <button className="deposit">DEPOSITAR</button>
                                <button className="withdraw">SACAR</button>
                            </div>

                            <LogOut size={20} color="#e9b10e" className="logout-btn" onClick={logoutHandler} />
                        </div>
                    :  
                        <div className="user-area">
                            <button onClick={() => setShowAccountModal(true)} className="login-btn">LOGIN</button>
                            <button onClick={() => setShowAccountModal(true)} className="register-btn">CADASTRAR-SE</button>
                        </div>
                    }  

                </div>

                <div className="cellphone-menu-btn">

                    <AlignJustify onClick={toogleCellPhoneMenu} size={36} color="white" />
                </div>
            </div>
        </>
    )
}

export default Header;