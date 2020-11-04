import React from 'react';
import TagTimeLeft from './TimeLeftIndicator/TagTimeLeft';

const AuctionCard = (props) => {
    const { id, time_left } = props.auction.item;
    console.log(props);
    return (
      <div className="column is-3">
        <div className="card">
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-4">{id}</p>
              </div>
            </div>
            <div className="content">
              <ul>
                <li><p>Price : {props.auction.item.buyout / 1000} POs</p></li>
                <li><p>Ilvl : 28</p></li>
                <li><p>id item : {id} </p></li>
              </ul>
              <br />
              <TagTimeLeft timeLeft={time_left} />
            </div>
          </div>
        </div>
      </div>
    );
  }
;

export default AuctionCard;
