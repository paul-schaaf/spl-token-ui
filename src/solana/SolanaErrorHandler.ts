export const getErrorMessage = (err: Error) => {
  if (err.message.startsWith("Transaction was not confirmed in")) {
    return (
      err.message +
      ". This does NOT necessarily mean it failed, just that it's taking longer than usual. Please check yourself in the explorer."
    );
  } else {
    return err.message;
  }
};
