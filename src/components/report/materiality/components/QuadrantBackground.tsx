
import React from 'react';

export const quadrantStyles = {
  container: {
    position: 'relative' as 'relative',
    width: '100%',
    height: '600px',
  },
  backgroundQuadrants: {
    position: 'absolute' as 'absolute',
    top: '60px',
    left: '60px',
    right: '30px',
    bottom: '50px',
    zIndex: 0,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
  },
  topRight: {
    backgroundColor: 'rgba(254, 243, 199, 0.3)', // Amber-50 with opacity
    borderTopRightRadius: '8px',
  },
  topLeft: {
    backgroundColor: 'rgba(254, 243, 199, 0.1)', // Amber-50 with less opacity
  },
  bottomRight: {
    backgroundColor: 'rgba(254, 243, 199, 0.15)', // Amber-50 with medium opacity
    borderBottomRightRadius: '8px',
  },
  bottomLeft: {
    backgroundColor: 'rgba(254, 243, 199, 0.05)', // Amber-50 with very little opacity
    borderBottomLeftRadius: '8px',
  },
};

const QuadrantBackground: React.FC = () => {
  return (
    <div style={quadrantStyles.backgroundQuadrants}>
      <div style={quadrantStyles.topLeft}></div>
      <div style={quadrantStyles.topRight}></div>
      <div style={quadrantStyles.bottomLeft}></div>
      <div style={quadrantStyles.bottomRight}></div>
    </div>
  );
};

export default QuadrantBackground;
