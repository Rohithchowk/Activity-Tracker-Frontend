import React, { useState, useEffect } from 'react';
import './Title.css';
import { Button } from '@mui/material';
import axios from 'axios';

function Title({ onDashboardClick }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isNameStored, setIsNameStored] = useState(false);
    const [nameExists, setNameExists] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedPassword = localStorage.getItem('password');
        const storedMobileNumber = localStorage.getItem('mobileNumber');
        if (storedName) {
            setUserName(storedName);
            setIsNameStored(true);
        }
        if (storedPassword) {
            setPassword(storedPassword);
        }
        if (storedMobileNumber) {
            setMobileNumber(storedMobileNumber);
        }
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'userName') {
            setUserName(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'mobileNumber') {
            setMobileNumber(value);
        }
    };

    const handleSaveName = () => {
        // Check if the name exists in the database
        axios.get(`http://localhost:9000/checkName/${userName}`)
            .then(response => {
                if (response.data.available) {
                    // Name is available, store in localStorage
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('password', password);
                    localStorage.setItem('mobileNumber', mobileNumber);
                    setIsNameStored(true);
                    // Reset nameExists state
                    setNameExists(false);
                } else {
                    // Name already exists, set warning
                    setNameExists(true);
                }
            })
            .catch(error => {
                console.error('Error checking name:', error);
            });
    };

    return (
        <div className="Title">
           <p style={{color:"blue",size:"80px"}}> Time Tracker (eLitmus project)</p>
            <div>
                {isNameStored ? (
                    <>
                        <h1 style={{color:"orange"}}>{userName}</h1>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter your unique name"
                            value={userName}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="mobileNumber"
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={handleInputChange}
                        />
                        <Button
                            onClick={handleSaveName}
                            size="small"
                            sx={{ borderRadius: '20px', marginLeft: '10px' }}
                        >
                            Save
                        </Button>
                    </>
                )}
                {nameExists && (
                    <span style={{ color: 'red' }}>This name already exists. Please choose a different one.</span>
                )}
            </div>
            <Button
                onClick={onDashboardClick}
                size="large"
                sx={{ borderRadius: '20px', marginLeft: '10px' }}
            >
                Dashboard
            </Button>
        </div>
    );
}

export default Title;
