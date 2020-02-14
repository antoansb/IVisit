import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideBar.css';

const SideBar = props => {
    const content = 
        <CSSTransition in={props.show} timeout={3000} classNames="slide-in-left" mountOnEnter unmountOnExit>
            <aside className="side-bar" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    
    return  ReactDOM.createPortal(content, document.getElementById('bar-hook'));
};

export default SideBar;