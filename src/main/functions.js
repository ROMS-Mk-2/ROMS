exports.runQueryDB = (db, query) => {
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.handleSQLCommandsDB = async (event, db, command) => {
  return new Promise((resolve, reject) => {
    let result = [];
    db.all(command, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        result = [...rows];
        // console.log(result);
        resolve(result);
      }
    });
  });
};
