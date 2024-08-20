import React from 'react';
import './Rack.css';

const Rack = ({ rack, onDragStart, onDragOver, onDrop }) => {
  return (
    <div className="rack">
      {rack.map((tile, index) => (
        <div
          key={index}
          className="rack-cell"
          onDragOver={onDragOver}
          onDrop={(event) => onDrop(event, index)}
        >
          {tile && (
            <div
              draggable
              onDragStart={(event) => onDragStart(event, index, 'rack')}
              className="rack-tile"
            >
              {tile}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Rack;
