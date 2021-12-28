import React, {useContext} from 'react'
import { stateContext } from '../Main';

import './index.scss'

export default function Grid() {
    const {gridFull, cols, rows} = useContext(stateContext);

    return (
        <div className='grid mx-auto border border-danger'>
            
        </div>
    )
}
