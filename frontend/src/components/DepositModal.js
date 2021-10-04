import React, { useState, useEffect } from 'react';

/**
* @Lib
*/
import { XCircle } from 'react-feather';

/**
* @Config
*/
import config from '../config'
import api from '../lib/api';

/**
* 
* @Styles
*/
import './DepositModal.css';

function DepositModal(props) {

    const[depositAmount, setDepositAmount] = useState("");

    function changeDepositAmount(value) {
        
        let val = value.replace("R$ ", "");

        if (isNaN( parseInt(val) )) {

            if (val == "") 
                setDepositAmount("");
            return;
        };

        val = "R$ " + String(parseInt(val));

        setDepositAmount(val);
    }

    function depositHandler() {

        const amount = parseInt( depositAmount.replace("R$ ", "") );
        const token = localStorage.getItem("x-user-token");

        api.post("/create_payment", { amount }, { headers: { authorization: `Baerer ${token}` } })
        .then(response => {

            const { init_point } = response.data;
            window.open(init_point);
        })
        .catch(err => {

            alert("Algo deu errado, tente novamente mais tarde!");
        })
    }

    return(
        <div className="deposit-modal-wrapper">

            <div className="modal">

                <div className="header">

                    <h2 style={{ color:"white" }}>{config.PROJECT_NAME}.<span style={{ color:"#e9b10e" }}>{config.PROJECT_SUBNAME}</span></h2>

                    <h2 style={{ color:"white", fontWeight:"300", fontSize:"18px" }}>Realizar depósito</h2>

                    <XCircle onClick={props.onCloseModal} className="close-modal-btn" size={16} color="rgba(255, 255, 255, 0.5)" />
                </div>

                <div className="deposit-amount">

                    <input value={depositAmount} onChange={e => changeDepositAmount(e.target.value)} className="text-area" placeholder="R$ 0,00" />
                </div>

                <div className="withdraw-btn-area">
                    <button onClick={depositHandler} className="withdraw-btn">Depositar</button>
                </div>
                
            </div>
        </div>
    )
}

export default DepositModal;