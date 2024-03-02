const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const SSE = require("sse");
exports.latestBlockEvent = catchAsync(async (req, res, next) => {
  //write the headers
  const headers = {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  // real time data
  setInterval(async () => {
    const resp = await axios.get("http://localhost:5000/api/blocks/latestFive");
    const data = await resp.data;
    console.log(data);
    res.write(`data:${JSON.stringify(data)}`);
  }, 2000);

  //close the connection on the request from the frontend
  //   req.on("close", () => {
  //     console.log(`Connection closed`);
  //   });
});
