import React from 'react';
import AuctionCard from './AuctionCard';
import { useQuery } from 'react-query';
import axios from 'axios';


const AuctionCards = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios.get('http://localhost:3000/auctions?users_id=1').then(response => {
      if (response) {
        setIsLoading(false);
        setData(response);
      }
    }).catch(error => {
      setIsLoading(false);
      setError(error);
    });
  }, []);

  // const { isLoading, error, data } = useQuery('auctionsData', () =>
  //   fetch('http://localhost:3000/auctions?users_id=1').then(res =>
  //     res.json().then((data) => {
  //       return data;
  //     }),
  //   ),
  // );
  //
  // if (isLoading) return 'Loading...';
  //
  // if (error) return 'An error has occurred: ' + error.message;

  const renderCards = () => {
    return data.data.map((auction, index) => {
      return (
        <AuctionCard
          key={index}
          auction={auction}
        />
      );
    });
  };

  return (
    <div className="columns is-multiline">
      {error !== null ? 'An error occured' : null}
      {isLoading && data ? renderCards() : 'Loading...'}
    </div>
  );
};

export default AuctionCards;
