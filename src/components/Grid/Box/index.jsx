import React from 'react'

export default function Box(props) {
    const {id, row, col, value, dispatch} = props;

    const selectBox = () => {
        dispatch({type: 'SET_SELECT', payload: {row, col}});
    }

    const boxClass = value ? 'box alive' : 'box dead';

    return (
        <div onClick={selectBox} className={boxClass} id={id}></div>
    )
}
