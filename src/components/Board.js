import React from 'react';
import './Board.css';

const Board = ({ board, onDragOver, onDrop, onDragStart }) => {
  // const renderTile = (tile, index) => (
  //   <div
  //     key={index}
  //     className="board-cell"
  //     onDragOver={onDragOver}
  //     onDrop={(event) => onDrop(event, index)}
  //   >
  //     {tile && (
  //       <div
  //         draggable
  //         onDragStart={(event) => onDragStart(event, index, 'board')}
  //         className="board-tile"
  //       >
  //         {tile}
  //       </div>
  //     )}
  //   </div>
  // );
  const renderTile = (tile, index) => (
    <div
      key={index}
      className="tile"
      draggable={tile !== null}
      onDragStart={(event) => onDragStart(event, index, 'board')}
      onDrop={(event) => onDrop(event, index, 'board')}
      onDragOver={onDragOver}
    >
      {tile}
    </div>
  );

//   const renderLabels = () => {
//     const labels = [];
//     labels.push(<div key="corner" className="label"></div>); // Empty corner
//     for (let i = 0; i < 15; i++) {
//       labels.push(<div key={`col${i}`} className="label">{String.fromCharCode(65 + i)}</div>);
//     }
//     for (let i = 0; i < 15; i++) {
//       labels.push(<div key={`row${i}`} className="label">{i + 1}</div>);
//       for (let j = 0; j < 15; j++) {
//         labels.push(renderTile(board[i * 15 + j], i * 15 + j));
//       }
//     }
//     return labels;
//   };

//   return (
//     <div className="board-container">
//       {board.map((tile, index) => renderTile(tile, index))}
//     </div>
//   );
// };

const renderLabels = () => {
  const labels = [];
  labels.push(<div key="corner" className="label"></div>); // Empty corner
  for (let i = 0; i < 15; i++) {
    labels.push(<div key={`col${i}`} className="label">{String.fromCharCode(65 + i)}</div>);
  }
  for (let i = 0; i < 15; i++) {
    labels.push(<div key={`row${i}`} className="label">{i + 1}</div>);
    for (let j = 0; j < 15; j++) {
      labels.push(renderTile(board[i * 15 + j], i * 15 + j));
    }
  }
  return labels;
};

return (
  <div className="board-container">
    {renderLabels()}
  </div>
);
};

export default Board;
