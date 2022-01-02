import React, { useState, useEffect, useReducer, createContext } from 'react'
import Grid from '../Grid'

export const stateContext = createContext();

const INITIAL_STATE = {
    speed: 150,
    cols: 100,
    rows: 50,
    generations: 0,
    gridFull: []
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
                    const sep = Math.floor(Math.random() * 5);
                    if (sep === 1) {
                        seedArr[i][j] = true;
                    }
                }
            }
            return { ...state, gridFull: seedArr };

        case 'PLAY':
            const { gridFull, rows, cols } = state;
            let g = [...gridFull];
            let gPost = JSON.parse(JSON.stringify(gridFull));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    let count = 0;
                    if (i > 0) {
                        if (g[i - 1][j]) count++;
                    }
                    if (i > 0 && j < cols - 1) {
                        if (g[i - 1][j + 1]) count++;
                    }
                    if (i > 0 && j > 0) {
                        if (g[i - 1][j - 1]) count++;
                    }
                    if (i < rows - 1) {
                        if (g[i + 1][j]) count++;
                    }
                    if (i < rows - 1 && j > 0) {
                        if (g[i + 1][j - 1]) count++;
                    }
                    if (i < rows - 1 && j < cols - 1) {
                        if (g[i + 1][j + 1]) count++;
                    }
                    if (j > 0) {
                        if (g[i][j - 1]) count++;
                    }
                    if (j < cols - 1) {
                        if (g[i][j + 1]) count++;
                    }

                    if (g[i][j]) {
                        if (count < 2 || count > 3) {
                            gPost[i][j] = false;
                        }
                    } else {
                        if (count === 3) {
                            gPost[i][j] = true;
                        }
                    }
                }
            }

            return { ...state, gridFull: gPost, generations: state.generations + 1 }

        case 'CLEAR':
            const resetArr = new Array(state.rows).fill().map(() => new Array(state.cols).fill(false));
            return { ...INITIAL_STATE, gridFull: resetArr }

        default:
            return INITIAL_STATE;
    }
}

export default function Main() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [timer, setTimer] = useState(null);// store setInterval
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        dispatch({ type: 'SET_MAP' });
    }, [])

    useEffect(() => {
        if (isActive) {
            const interval = setInterval(() => {
                dispatch({ type: 'PLAY' });
            }, state.speed)
            setTimer(interval);
        } else {
            clearInterval(timer);
            setTimer(null);
        }
    }, [isActive])

    const triggerPlay = () => {
        setActive(true);
    }

    const stopPlay = () => {
        setActive(false);
    }

    const clear = () => {
        stopPlay();
        dispatch({ type: 'CLEAR' });
    }

    return (
        <div className='main container mx-auto'>
            <div className='d-flex justify-content-center mb-3'>
                <div className="btn-group me-2">
                    <button className='btn btn-primary' onClick={triggerPlay}>PLAY</button>
                    <button className='btn btn-danger' onClick={stopPlay}>STOP</button>
                    <button className='btn btn-outline-warning' onClick={clear}>CLEAR</button>
                </div>
                <div className="btn-group">
                    <button className='btn btn-outline-success' onClick={() => { dispatch({ type: 'SET_SEED' }) }}>SEED</button>
                </div>
            </div>
            <stateContext.Provider value={state}>
                <Grid dispatch={dispatch} />
            </stateContext.Provider>
            <h2 className='fs-5 mt-3'>Generations: {state.generations}</h2>
        </div>
    )
}
