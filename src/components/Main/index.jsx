import React, { useState, useEffect, useReducer, createContext } from 'react'
import Grid from '../Grid'

export const stateContext = createContext();

const INITIAL_STATE = {
    speed: 100,
    cols: 30,
    rows: 50,
    generations: 0,
    gridFull: [],
}

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'SET_MAP':
            const newArr = new Array(state.rows).fill().map(() => new Array(state.cols).fill(false));
            return { ...state, gridFull: newArr };
        default:
            return INITIAL_STATE;
    }
}


export default function Main() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const { gridFull, cols, rows } = state;

    useEffect(() => {
        dispatch({ type: 'SET_MAP' });
    }, [])

    return (
        <div className='main container mx-auto'>
            <stateContext.Provider value={state}>
                <Grid />
            </stateContext.Provider>
            <h2 className='fs-4'>Generations:{state.generations}</h2>
        </div>
    )
}
