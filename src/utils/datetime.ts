export const formatTimestamp = (timestamp?: number) => {
  const timestampDatetime = timestamp ? new Date(timestamp) : new Date();
  return timestampDatetime.getFullYear()
  + ('0' + (timestampDatetime.getMonth()+1)).slice(-2)
  + ('0' + timestampDatetime.getDate()).slice(-2)
  + timestampDatetime.getHours()
  + ('0' + (timestampDatetime.getMinutes())).slice(-2)
  + timestampDatetime.getSeconds();
}
