import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import io from 'socket.io-client';

/**
*@Styles
*/
import './CrashGame.css';

/**
* @Lib
*/
import currency from '../lib/currency';

/**
 * @Context
 */
 import { GlobalContext } from '../providers/global';

function CrashGame(props) {

    const { userBalance, setUserBalance, addNotify } = React.useContext(GlobalContext);

    const[btnState, setBtnState] = useState(0);

    const[betAmount, setBetAmount] = useState("");
    const[recentBetAmount, setRecentBetAmount] = useState(0.0);

    const[playerTotalReward, setPlayerTotalReward] = useState(0.0);
    const[playerInMatch, setPlayerInMatch] = useState(false);

    const[autoWithdraw, setAutoWithDraw] = useState(false);
    const[autoWithdrawVal, setAutoWithDrawVal] = useState(0.0);

    // CRASH INFO //
    const[inCrashMatch, setInCrashMatch] = useState(false);
    const[crashGameMultiplier, setCrashGameMultiplier] = useState(1.0);
    const[nextMatchInSeconds, setNextMatchInSeconds] = useState(10);

    const[latestResults, setLatestResults] = useState([]);

    const[totalPlayers, setTotalPlayers] = useState(0);
    const[totalMoney, setTotalMoney] = useState(0);

    function changeBetAmount(value) {

        setBetAmount(value);
    }

    function betHandler() {

        const token = localStorage.getItem("x-user-token");

        api.post("/bet_crash", { 
            bet_amount: parseFloat(betAmount)
        },
        { headers: { authorization: `Baerer ${token}` }})
        .then(response => {

            setUserBalance(userBalance - parseFloat(betAmount));
            setRecentBetAmount(parseFloat(betAmount));
            setPlayerInMatch(true);
            addNotify("Apostado com sucesso!", "sucess", 5);
        })
        .catch(err => {

            const message = err.response.data.message;

            if (message == "You already betted in this match!") {

                return addNotify("Você já tem uma aposta nesta rodada!", "err", 5);
            }

            if (message == "Game already started!") {

                return addNotify("Você não pode apostar enquanto a partida acontece!", "err", 5);
            }

            if (message == "Insufficient funds") {

                return addNotify("Saldo insuficiente!", "err", 5);
            }

            addNotify("Ocorreu um problema, tente novamente mais tarde", "err", 5);
        })
    }

    function unbetHandler() {

        const token = localStorage.getItem("x-user-token");

        api.post("/stop_bet_crash", null,
        { headers: { authorization: `Baerer ${token}` }})
        .then(response => {

            const reward = (recentBetAmount * crashGameMultiplier).toFixed(2);

            setUserBalance(userBalance + parseFloat(reward))

            setPlayerInMatch(false);
            setPlayerTotalReward(reward);
            addNotify("Retirado com sucesso!", "sucess", 5);
        })
        .catch(err => {

            const message = err.response.data.message;

            if (message == "None match in progress right now...") {

                return addNotify("Nenhuma partida acontecendo agora...", "err", 5);
            }

            if (message == "Bet not found!") {

                return addNotify("Aposta não encontrada!", "err", 5);
            }
        });
    }

    // WEBSOCKET
    useEffect(() => {

        const connection = io("http://192.168.224:30121");
        let last_event = "";

        connection.on("update-crash", data => {

            if (last_event == "update-timer") {

                setBtnState(1);
                setInCrashMatch(true);
            }
            
            setCrashGameMultiplier(data.crashGameMultiplier);

            if (last_event != "update-crash") {
                last_event = "update-crash";
            }
        })

        connection.on("update-timer", data => {

            if (last_event == "update-crash") {
                
                setRecentBetAmount(0.0);
                setCrashGameMultiplier(1.0);

                setBtnState(0);
                setInCrashMatch(false);
                setPlayerInMatch(false);
            }

            setNextMatchInSeconds(data.nextMatchInSeconds);

            if (last_event != "update-timer") {
                last_event = "update-timer";
            }
        });

        connection.on("update-latest-results", latestRes => {

            setLatestResults(latestRes);
        })

        connection.on("update-total-players", total => {
            setTotalPlayers(total);
        });
        connection.on("update-total-money", total => {
            setTotalMoney(total);
        });

        return () => connection.disconnect();

    }, [ setCrashGameMultiplier ])

    return(
        <div className="crash-game-wrapper">

            <div className="crash-game-container">

                <div className="left-container">

                    <div className="bet-controls">

                        <div className="crash-game-input">
                            <span className="placeholder focus">Quantidade</span>
                            
                            
                            <input value={betAmount} onChange={e => changeBetAmount(e.target.value)} className="text-area" />
                            
                        </div>
                        
                        <button className="division">½</button>
                        <button className="multiply">2x</button>
                    </div>

                    <div className="crash-game-input max-width">
                        <span className="placeholder focus">Auto retirar</span>
                        <input className="text-area" />
                    </div>


                    {btnState == 0 ? 
                        <button onClick={betHandler} className="bet-btn">Começar o jogo</button>
                    :null} 

                    {btnState == 1 ?
                        <button onClick={unbetHandler} className="bet-btn">Retirar</button>
                    :null}

                    <div className="bet-list-wrapper">

                        <div className="header">
                            <h2 className="total-players">{totalPlayers} jogadores</h2>

                            <p className="total-money">R$ {totalMoney.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="right-container">

                    <div className="crash-area">

                            {inCrashMatch ?     
                                <div className="counter">
                                    <p className="counter-text">{crashGameMultiplier.toFixed(2)}x</p>
                                </div>
                            :   
                                
                                <div className="progress-bar-container">
                                    <p className="text">Começando em {nextMatchInSeconds.toFixed(2)} segundos</p>
                                    <progress className="progress-bar" value={nextMatchInSeconds.toFixed(2)} max="10"/>
                                </div>
                                
                            }
                    </div>
                    
                    <div className="total-user-reward">
                        <p className="text">
                            TOTAL: { playerInMatch ? "R$ " + String((recentBetAmount * crashGameMultiplier).toFixed(2)) : "R$ " + String((playerTotalReward))}
                        </p>
                    </div>

                    <div className="latest-results-wrapper">
                        {latestResults.map((item, index) => {

                            return(
                                <div className={parseFloat(item) < 2 ? "result" : "result profit" } key={index}>
                                    {item.toFixed(2)}x
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrashGame;