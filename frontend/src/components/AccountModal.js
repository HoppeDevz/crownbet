import React, { useEffect, useState } from 'react';

/**
* @Config
*/
import CONFIG from '../config/index';


/**
* @Styles
*/
import './AccountModal.css';

function AccountModal(props) {

    const[modalState, setModalState] = useState(props.modalState || 0);
    const[inputFocus, setInputFocus] = useState("");

    // LOGIN
    const[userEmail, setUserEmail] = useState("");
    const[userPassword, setUserPassword] = useState("");

    // REGISTER
    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[birthDate, setBirthDate] = useState();

    function LoginHandler() {

        console.log({ userEmail, userPassword });
    }

    function RegisterHandler() {

        console.log({
            username,
            email,
            password,
            birthDate
        })
    }
    
    return(
        <div className="account-modal-wrapper">

            <div className="modal">

                <div className="modal-switch">
                    <button className={modalState == 0 ? "btn selected" : "btn"} onClick={() => setModalState(0)}>Entrar</button>

                    <button className={modalState == 1 ? "btn selected" : "btn"} onClick={() => setModalState(1)}>Cadastre-se</button>
                </div>

                {modalState == 0 ?
                    <>
                        <div className="modal-title">
                            <h1 className="project-name">{CONFIG.PROJECT_NAME}.<span className="sub-name">{CONFIG.PROJECT_SUBNAME}</span></h1>
                            <h2 className="desc">Entre com a sua conta</h2>
                        </div>

                        <form className="modal-form">

                            <div className="form-input">
                                <span className={inputFocus == "email" || userEmail != "" ? "placeholder focus" : "placeholder"}>Email</span>
                                <input value={userEmail} onChange={e => setUserEmail(e.target.value)} onFocus={() => setInputFocus("email")} className="text-area" type="text" />
                            </div>
                            
                            <div className="form-input">
                                <span className={inputFocus == "password" || userPassword != "" ? "placeholder focus" : "placeholder"}>Senha</span>
                                <input value={userPassword} onChange={e => setUserPassword(e.target.value)} onFocus={() => setInputFocus("password")} className="text-area" type="password" />
                            </div>
                        </form>

                        <div className="login-btn-area">
                            <button onClick={LoginHandler} className="login-btn">Entrar</button>
                        </div>
                        
                    </>
                :
                    <>
                        <div className="modal-title">
                            <h1 className="project-name">{CONFIG.PROJECT_NAME}.<span className="sub-name">{CONFIG.PROJECT_SUBNAME}</span></h1>
                            <h2 className="desc">Cadastre-se agora mesmo!</h2>
                        </div>

                        <form className="modal-form">

                                <div className="form-input">
                                    <span className={inputFocus == "username" || username != "" ? "placeholder focus" : "placeholder"}>Nome de exibição</span>
                                    <input value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setInputFocus("username")} className="text-area" type="text" />
                                </div>
                                
                                <div className="form-input">
                                    <span className={inputFocus == "email-r" || email != "" ? "placeholder focus" : "placeholder"}>E-mail</span>
                                    <input value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setInputFocus("email-r")} className="text-area" type="email" />
                                </div>

                                <div className="form-input">
                                    <span className={inputFocus == "password-r" || password != "" ? "placeholder focus" : "placeholder"}>Senha</span>
                                    <input value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setInputFocus("password-r")} className="text-area" type="password" />
                                </div>

                                <div className="form-input">
                                    <span className="placeholder focus">Data de nascimento</span>
                                    <input value={birthDate} onChange={e => setBirthDate(e.target.value)} className="text-area" type="date" />
                                </div>
                        </form>

                        <div className="register-btn-area">

                            <button onClick={RegisterHandler} className="register-btn">Registrar-se</button>
                        </div>
                    </>
                }
                
            </div>
        </div>
    )
}

export default AccountModal;