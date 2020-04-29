import React, {useEffect} from 'react';
const sql = require("mssql");
require("msnodesqlv8");

const Sqltest = () => {
  useEffect(() => {
    const conn = new sql.Connection({
      database: "{/* Removed due to contract */}",
      server: "{/* Removed due to contract */}",
      driver: "msnodesqlv8",
      options: {
        trustedConnection: true
      }
    });
    conn.connect().then(() => {
      // ... sproc call, error catching, etc
      // example: https://github.com/patriksimek/node-mssql#request
      console.log('connected')
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div>
      
    </div>
  );
};

export default Sqltest;