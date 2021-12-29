import React, { useState, useEffect, useReducer, createContext } from 'react'
import Grid from '../Grid'

export const stateContext = createContext();

const INITIAL_STATE = {
    speed: 100,
    cols: 100,
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

        case 'SET_SELECT':
            const { row, col } = payload;
            const editArr = [...state.gridFull];
            editArr[row][col] = !editArr[row][col];
            return { ...state, gridFull: editArr };

        case 'SET_SEED':
            const seedArr = [...state.gridFull];
            for (let i = 0; i < state.rows; i++) {
                for (let j = 0; j < state.cols; j++) {
                    const sep = Math.floor(Math.random() * 4);
                    if (sep === 1) {
                        seedArr[i][j] = true;
                    }
                }
            }
            return { ...state, gridFull: seedArr };

        case 'PLAY': 
            const {gridFull, rows, cols} = state;
            let g = gridFull;
            let gPost = [...gridFull];
            for(let i = 0; i < rows; i ++) {
                for(let j = 0 ; j < cols; j ++) {
                    let count = 0;
                    if(i - 1 >= 0) {
                        if(g[i - 1][j]) count ++;
                    } 
                    if(i - 1 >= 0 && j - 1 >= 0) {
                        if(g[i - 1][j - 1]) count ++;
                    }
                    if(i - 1 >= 0 && j + 1 < cols) {
                        if(g[i - 1][j + 1]) count ++;
                    }
                    if(j - 1 >= 0) {
                        if(g[i][j - 1]) count ++;
                    }
                    if(j + 1 < cols) {
                        if(g[i][j + 1]) count ++;
                    }
                    if(i + 1 < rows) {
                        if(g[i + 1][j]) count ++;
                    }
                    if(i + 1 < rows && j - 1 >= 0) {
                        if(g[i + 1][j - 1]) count ++
                    }
                    if(i + 1 < rows && j + 1 < cols) {
                        if(g[i + 1][j + 1]) count ++
                    }
                    
                    if(g[i][j]) {
                        if(count < 2 || count > 3) {
                            gPost[i][j] = false;
                        } 
                    } else {
                        if(count === 3) {
                            gPost[i][j] = true;
                        }
                    }
                }
            }

            return {...state, gridFull: gPost, generations: state.generations ++}
        case 'CLEAR':
            const resetArr = new Array(state.rows).fill().map(() => new Array(state.cols).fill(false));
            return {...INITIAL_STATE, gridFull: resetArr}
        default:
            return INITIAL_STATE;
    }
}


export default function Main() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [gen, setGen] = useState(0);
    let timer = null;

    useEffect(() => {
        dispatch({ type: 'SET_MAP' });
    }, [])

    useEffect(() => {
        console.log('gen is change');
        setGen(state.generations);
    }, [state.generations])

    const triggerPlay = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
            dispatch({type: 'PLAY'});
            console.log('tick');
        }, state.speed);
    }

    const stopPlay = () => {
        window.clearInterval(timer);
    }

    return (
        <div className='main container mx-auto'>
            <button className='btn btn-primary' onClick={triggerPlay}>PLAY</button>
            <button className='btn btn-danger' onClick={stopPlay}>STOP</button>
            <button className='btn btn-warning' onClick={() => {dispatch({type: 'CLEAR'})}}>CLEAR</button>
            <button className='btn btn-primary' onClick={() => { dispatch({ type: 'SET_SEED' }) }}>SEED</button>
            <stateContext.Provider value={state}>
                <Grid dispatch={dispatch} />
            </stateContext.Provider>
            <h2 className='fs-4'>Generations:{gen}</h2>
        </div>
    )
}
