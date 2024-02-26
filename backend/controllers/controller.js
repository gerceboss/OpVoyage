const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config("");


const sdk = require('api')('@nodereal/v1.5#10tuepy34l8ithl0p');

exports.latestBlock = catchAsync(async (req,res) =>{

    //fetching block number
    const data = await sdk.ethBlocknumber({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_blockNumber'
      }, {
        apiKey: process.env.api_key
      })
    res.status(200).json({
        status: 'success',
        data
    })
})