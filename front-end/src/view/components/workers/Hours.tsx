import React from 'react';
import { Worker } from '../../../data';
import { hoursWorkPerUser } from '../../../data/financier';
import useData from '../../../data/hooks';

const Hours = (props: {user: Worker}) => {
  const { user } = props;
  let hours: number | null;
  hours = 5.57;
  hours = useData(async () => hoursWorkPerUser(user._id));
  let minutes = 0;
  if (hours) minutes = (hours! - Math.floor(hours!)) * 60;
  let hoursText = '0:00';
  if (hours && minutes > 10) hoursText = `${Math.floor(hours)}:${Math.floor(minutes)}`;
  else if (hours) hoursText = `${Math.floor(hours)}:0${Math.floor(minutes)}`;

  return (
    <span>
      {hoursText}
    </span>
  );
};

export default Hours;
