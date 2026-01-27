import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { $host } from '../http'; 
import classes from './Auth.module.css'; 

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    

    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const click = async () => {
        try {
            let response;
            if (isLogin) {
                response = await $host.post('user/login', { email, password });
            } else {
                response = await $host.post('user/registration', { email, password });
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);


            navigate('/');
            
        } catch (e) {
            setError(e.response?.data?.message || "Ein unbekannter Fehler is aufgetreten");
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <h2 className={classes.title}>
                    {isLogin ? 'Anmeldung' : 'Registrierung'}
                </h2>

                <div className={classes.inputGroup}>
                    <input
                        className={classes.input}
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                </div>

                <div className={classes.inputGroup}>
                    <input
                        className={classes.input}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </div>

                {error && <div className={classes.error}>{error}</div>}

                <button className={classes.button} onClick={click}>
                    {isLogin ? 'Anmelden' : 'Ein neues Konto erstellen'}
                </button>

                <div className={classes.switch}>
                    {isLogin ? (
                        <div>
                            Haben Sie noch kein Konto?
                            <span 
                                className={classes.link} 
                                onClick={() => { setIsLogin(false); setError(null); }}
                            >
                                Melden Sie sich an!
                            </span>
                        </div>
                    ) : (
                        <div>
                            Haben Sie bereits ein Konto? 
                            <span 
                                className={classes.link} 
                                onClick={() => { setIsLogin(true); setError(null); }}
                            >
                                Jetzt anmelden!
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;