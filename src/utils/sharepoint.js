export const spListApiUrl = list => {
  return `${process.env.REACT_APP_SP_BASEURL}_api/web/lists/getByTitle('${list}')/items`
};

export const spListById = listId => {
  return `${process.env.REACT_APP_SP_BASEURL}_api/web/lists/getById('${listId}')/items`
}

export const spConfig = {
  withCredentials: true,
  headers: {
    'Accept': "application/json;odata=verbose",
  }
};