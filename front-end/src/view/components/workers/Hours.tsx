import React from 'react';
import { User } from '../../../data';
import { hoursOfWorkOfUser } from '../../../data/financier';
import useData from '../../../data/hooks';

const Hours = (props: {user: User}) => {
  const { user } = props;
  let hours: number | null;
  hours = 20;
  hours = useData(async () => hoursOfWorkOfUser(user._id));
  let hoursText = '0:00';
  if (hours && hours % 60 > 10) hoursText = `${Math.floor(hours / 60)}:${hours % 60}`;
  else if (hours) hoursText = `${Math.floor(hours / 60)}:0${hours % 60}`;

  return (
    <span>
      {hoursText}
    </span>
  );
};

export default Hours;
