import moment from "moment";

export const formatDate = (unixTimestamp) => {
  return moment.unix(unixTimestamp).format("ddd, Do MMM YYYY");
};

export const formatDateTime = (unixTimestamp) => {
  return moment.unix(unixTimestamp).format("Do MMM HH:mm:ss");
};
