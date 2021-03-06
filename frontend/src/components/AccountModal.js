import React, { useEffect, useState } from 'react';

/**
* @Lib
*/
import api from '../lib/api';
import { Info, XCircle } from 'react-feather';

/**
* @Components
*/
import MouseHoverModal from './MouseHoverModal';

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

    // MOUSE HOVER MODAL
    const[isActiveMouseHoverModal, setIsActiveMouseHoverModal] = useState(false);
    const[mouseHoverModalContent, setMouseHoverModalContent] = useState("");

    function EnableMouseHoverModal(text) {

        setMouseHoverModalContent(text);
        setIsActiveMouseHoverModal(true);
    }

    function DisableMouseHoverModal() {

        setIsActiveMouseHoverModal(false);
    }

    function LoginHandler() {

        api.get("/user_login", {
            headers: {
                "x-email": userEmail,
                "x-password": userPassword
            }
        })
        .then(response => {

            if (response.data.token) {

                localStorage.setItem("x-user-token", response.data.token);
                props.onLoginHandler(response.data.token);
            }
        })
        .catch(err => {

            alert("Login e/ou senha inválido(s)!");
        })
    }

    function RegisterHandler() {

        if (!VerifyParam("username", username)) return alert("Usuário inválido!");
        if (!VerifyParam("email", email)) return alert("E-mail inválido!");
        if (!VerifyParam("password", password)) return alert("Senha inválida!");
        if (!VerifyParam("birthDate", birthDate)) return alert("Você deve ser maior de 18 anos!");

        
        api.post("/register_account", {
            username,
            email,
            password,
            birthDate
        })
        .then(sucess => {

            alert("Conta criada com sucesso!");
            setModalState(0);
        })
        .catch(err => {
            
            const message = (err.response.data.message);

            if (message == "Username already in use!") {

                return alert("Nome de usuário já está em uso!");
            }

            if (message == "Email already in use!") {

                return alert("Este e-mail já está em uso!");
            }

            alert("Algo deu errado, tente novamente mais tarde...");
        });
    }

    function VerifyParam(paramType, param) {

        const MIN_PASSWORD_LENGTH = 8;
        const MIN_USERNAME_LENGTH = 6;

        if (paramType == "password") {

            return param.length >= MIN_PASSWORD_LENGTH || param == "";
        }

        if (paramType == "email") {

            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmail = re.test(String(param).toLowerCase());

            return isEmail || param == "";
        }

        if (paramType == "username") {

            return param.length >= MIN_USERNAME_LENGTH || param == "";
        }

        if (paramType == "birthDate") {

            const date = new Date(param).getTime();
            const currentDate = new Date().getTime();
            const years = new Date(currentDate - date).getFullYear() - 1970;

            return years >= 18;
        }
    }
    
    return(
        <>
            <MouseHoverModal activeModal={isActiveMouseHoverModal} content={mouseHoverModalContent} />

            <div className="account-modal-wrapper">

                <div className="modal">

                    <div className="modal-switch">
                        <button className={modalState == 0 ? "btn selected" : "btn"} onClick={() => setModalState(0)}>Entrar</button>

                        <button className={modalState == 1 ? "btn selected" : "btn"} onClick={() => setModalState(1)}>Cadastre-se</button>

                        <XCircle onClick={props.onCloseModalHandle} className="close-modal-btn" size={16} color="rgba(255, 255, 255, 0.5)" />
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

                                    <div className={VerifyParam("username", username) ? "form-input": "form-input error"}>
                                        {!VerifyParam("username", username) ?
                                            <Info
                                                onMouseEnter={() => EnableMouseHoverModal("O nome de usuário deve ter pelo menos 6 caracteres!")}
                                                onMouseLeave={DisableMouseHoverModal}

                                                className="err-info" 
                                                size={13} 
                                                color="crimson" />
                                        : null}

                                        <span className={inputFocus == "username" || username != "" ? "placeholder focus" : "placeholder"}>Nome de exibição</span>
                                        <input value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setInputFocus("username")} className="text-area" type="text" />
                                    </div>
                                    
                                    <div className={VerifyParam("email", email) ? "form-input": "form-input error"}>
                                        {!VerifyParam("email", email) ?
                                            <Info 
                                                onMouseEnter={() => EnableMouseHoverModal("O endereço deve ser válido!")}
                                                onMouseLeave={DisableMouseHoverModal}
                                                
                                                className="err-info" 
                                                size={13} 
                                                color="crimson" />
                                        : null}

                                        <span className={inputFocus == "email-r" || email != "" ? "placeholder focus" : "placeholder"}>E-mail</span>
                                        <input value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setInputFocus("email-r")} className="text-area" type="email" />
                                    </div>

                                    <div className={VerifyParam("password", password) ? "form-input": "form-input error"}>
                                        {!VerifyParam("password", password) ?
                                            <Info
                                                onMouseEnter={() => EnableMouseHoverModal("A senha deve ter pelo menos 8 caracteres!")}
                                                onMouseLeave={DisableMouseHoverModal}

                                                className="err-info" 
                                                size={13} 
                                                color="crimson" />
                                        : null}

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
        </>
    )
}

export default AccountModal;