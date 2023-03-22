import React from 'react';
import ReactSlider from 'react-slider';
import "./style.css";
const Range = (props) => {

    const updateRange = (e)=>{
        debugger
        props.updateRange(e);
    }

    
    return (
        <div style={{backgroundColor:'#333',padding:10,borderRadius:'5px',marginBottom:'5px'}}>
            <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                value={props.range}
                min="1"
                max={props.maxRange}
                onChange={(e) => {
                updateRange(e);
                }}
                renderTrack={(props, state) => (
                <div {...props}>{state.valueNow}</div>
                )}
            />
            {/* <input id="range" type="range"
                value={props.range}
                min="1"
                max={props.maxRange}
                step="1"
                onChange={(e)=>updateRange(e)}
            /> */}
      </div>
    );
}

export default Range;

  