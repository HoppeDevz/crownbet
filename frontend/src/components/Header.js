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
import DepositModal from './DepositModal';

/**
 * 
 * @Styles
 */
import './Header.css';
import api from '../lib/api';

/**
 * @Context
 */
import { GlobalContext } from '../providers/global';

function Header(props) {

    const { userBalance, setUserBalance } = React.useContext(GlobalContext);

    const[showDepositModal, setShowDepositModal] = useState(false);
    const[showAccountModal, setShowAccountModal] = useState(false);
    const[showCellphoneMenu, setShowCellPhoneMenu] = useState(false);

    const[logged, setLogged] = useState(false);

    const[gameSelected, setGameSelected] = useState(props.gameSelected);

    function onChangeGameHandler(gameId) {

        setGameSelected(gameId);
        props.onChangeGame(gameId);
    }

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

        window.addEventListener("x-update-balance", data => {

            console.log(data);
        })

        const token = localStorage.getItem("x-user-token");

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

    }, [ setLogged ])

    return(
        <>
            {showAccountModal ?
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

                    gameSelected={gameSelected}
                    onChangeGame={onChangeGameHandler}
                />
            :null}

            {showDepositModal ? 
                <DepositModal onCloseModal={() => setShowDepositModal(false)} />
            :null}

            <div className="header-wrapper">
                
                <div className="left-container">
                    
                    <h1>
                        {CONFIG.PROJECT_NAME}.<span>{CONFIG.PROJECT_SUBNAME}</span>
                    </h1>
                </div>

                <div className="right-container">

                    <div className="games-area">
                        <button onClick={() => onChangeGameHandler(0)} className={gameSelected == 0 ? "game-btn selected" : "game-btn"}>CRASH</button>
                        <button onClick={() => onChangeGameHandler(1)} className={gameSelected == 1 ? "game-btn selected" : "game-btn"}>ROLETA</button>
                        <button onClick={() => onChangeGameHandler(2)} className={gameSelected == 2 ? "game-btn selected" : "game-btn"}>COINFLIP</button>
                    </div>

                    {logged ?
                        <div className="logged-user-area">

                            <div className="balance">
                                <p className="balance-label" >SALDO:</p>
                                <p className="balance-value">{currency.formatCurrency(userBalance)}</p>
                            </div>

                            <div className="balance-actions">
                                <button onClick={() => setShowDepositModal(true)} className="deposit">DEPOSITAR</button>
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