import React, {useState, useEffect} from 'react';
import moment from 'moment';

const Commit = props => {
  let date = props.commit.date;
  const [timeAgo, setTimeAgo] = useState(moment(date).fromNow());

  // update time ago every minute
  useEffect(() => {
    setInterval(() => {
      setTimeAgo(moment(date).fromNow())
    }, 60000)
  }, [date])

  return (
    <div key={props.commit.id}>
      <span>{`${props.commit.id} - `}</span>
      <span>{timeAgo}</span>
      <p>{props.commit.message}</p>
    </div>
  );
};

export default Commit;