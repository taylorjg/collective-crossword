import moment from "moment";

export const formatDate = (unixTimestamp) => {
  return moment.unix(unixTimestamp).format("dddd, DD MMMM YYYY");
};
