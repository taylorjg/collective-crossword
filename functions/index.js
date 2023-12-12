/* eslint-env node */

const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");

const { initializeApp } = require("firebase-admin/app");

initializeApp();

// TODO: move this into config of some sort ?
const PUZZLESDATA_URL = "https://puzzlesdata.telegraph.co.uk";

const getCrypticCrossword = async (id) => {
  const response = await axios.get(
    `${PUZZLESDATA_URL}/puzzles/cryptic-crossword-1/cryptic-crossword-${id}.json`
  );
  return response.data;
};

const getPrizeCryptic = async (id) => {
  const response = await axios.get(
    `${PUZZLESDATA_URL}/puzzles/prize-cryptic/prize-cryptic-${id}.json`
  );
  return response.data;
};

const opts = { cors: true };

exports.getCrypticCrossword = onRequest(opts, async (req, res) => {
  const id = req.query.id ?? req.body.data.id;
  logger.log("[getCrypticCrossword]", id);
  const data = await getCrypticCrossword(id);
  res.json({ data });
});

exports.getPrizeCryptic = onRequest(opts, async (req, res) => {
  const id = req.query.id ?? req.body.data.id;
  logger.log("[getPrizeCryptic]", id);
  const data = await getPrizeCryptic(id);
  res.json({ data });
});
