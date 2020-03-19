export default (methodic) => {
  fetch(`${process.env.PATH_DEV}savemethodic/update`, {
    method: 'POST',
    headers:
    {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      methodic,
    }),
  });
};
