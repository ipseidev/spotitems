import React from 'react';
import AuctionCard from './AuctionCard';

const data = [
  {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'SHORT',
    'server': 'Archimonde',
  },
  {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'SHORT',
    'server': 'Archimonde',
  }, {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'LONG',
    'server': 'Archimonde',
  },
  {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'MEDIUM',
    'server': 'Archimonde',
  }, {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'VERY_LONG',
    'server': 'Archimonde',
  },
  {
    'id': 1927699889,
    'item': {
      'id': 8494,
      'context': 0,
    },
    'buyout': 250006800,
    'quantity': 1,
    'time_left': 'SHORT',
    'server': 'Archimonde',
  },
];

const AuctionCards = () => {

  const renderCards = () => {
    return data.map(auction => {
      return (
        <AuctionCard
          auction={auction}
        />
      );
    });
  };

  return (
    <div className="columns">
      {renderCards()}
    </div>
  );
};

export default AuctionCards;
