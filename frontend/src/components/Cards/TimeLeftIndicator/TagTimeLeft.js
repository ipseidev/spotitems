import React from 'react';

const timesLeftEnum = {
  SHORT: 'is-info',
  MEDIUM: 'is-success',
  LONG: 'is-warning',
  VERY_LONG: 'is-danger',
};

const TagTimeLeft = (props) => {
  console.log(timesLeftEnum[props.timeLeft]);
  return (
    <span className={`tag ${timesLeftEnum[props.timeLeft]} is-light`}>{props.timeLeft}</span>
  );
};

export default TagTimeLeft;
