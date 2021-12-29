import React, { useContext, useEffect, useState } from 'react'
import { stateContext } from '../Main';

import Box from './Box'

import './index.scss'

export default function Grid(props) {
    const { gridFull, cols, rows } = useContext(stateContext);
    const {dispatch} = props;
    const [arrMap, setArrMap] = useState([]);
    const width = cols * 10;

    useEffect(() => {
        if (gridFull.length > 0) {
            const newArr = makeGridMap();
            setArrMap(newArr);
        }
    }, [gridFull])

    const makeGridMap = () => {
        let arr = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                arr.push({
                    id: `${i}_${j}`,
                    key: `${i}_${j}`,
                    row: i,
                    col: j,
                    value: gridFull[i][j]
                })
            }
        }

        return arr;
    }

    return (
        <div style={{ width: width }} className='grid mx-auto'>
            {
                arrMap.map(el => {
                    return (
                        <Box 
                            key={el.id} 
                            id={el.id} 
                            boxClass={el.boxClass} 
                            row={el.row} 
                            col={el.col} 
                            value={el.value} 
                            dispatch={dispatch}
                        />
                    )
                })
            }
        </div>
    )
}
