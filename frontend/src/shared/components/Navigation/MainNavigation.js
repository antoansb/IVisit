import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideBar from './SideBar';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = props => {
    const [barIsOpen, setBarIsOpen] = useState(false);

    const openBarHandler = () => {
        setBarIsOpen(true);
    };
    
    const closeBarHandler = () => {
        setBarIsOpen(false);
    };

    return (
        <React.Fragment>
            {barIsOpen ? <Backdrop onClick={closeBarHandler}/> : null} 
                <SideBar show={barIsOpen} onClick={closeBarHandler}>
                    <nav className="main-navigation__bar-nav">
                        <NavLinks />
                    </nav>
                </SideBar> 
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openBarHandler}>
                    <span />
                    <span />
                    <span /> 
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">
                        Your Places 
                    </Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks /> 
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;