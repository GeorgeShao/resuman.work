function getDateTime() {
  var currentdate = new Date();
  var datetime =
    "-" +
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    "-" +
    currentdate.getHours() +
    "-" +
    currentdate.getMinutes() +
    "-" +
    currentdate.getSeconds() +
    "-" +
    currentdate.getMilliseconds();
  return datetime;
}

export default getDateTime;
