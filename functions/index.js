/* eslint-env node */

const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");

const { initializeApp } = require("firebase-admin/app");

initializeApp();

// TODO: move this into config of some sort ?
const PUZZLESDATA_URL = "https://puzzlesdata.telegraph.co.uk";

const opts = { cors: true };

const getCommon = async (req, res, fnName, label, makeUrl) => {
  const id = req.query.id ?? req.body.data.id;
  logger.log(`[${fnName}]`, id);
  try {
    const url = makeUrl(id);
    const response = await axios.get(url);
    res.json({
      data: {
        puzData: response.data,
        puzUrl: url,
      },
    });
  } catch (error) {
    if (error?.response?.status === 404) {
      res.status(404).send(`Failed to find ${label} with id, "${id}".`);
    } else {
      throw error;
    }
  }
};

exports.getCrypticCrossword = onRequest(opts, async (req, res) => {
  const fnName = "getCrypticCrossword";
  const label = "cryptic crossword";
  const makeUrl = (id) =>
    `${PUZZLESDATA_URL}/puzzles/cryptic-crossword-1/cryptic-crossword-${id}.json`;
  await getCommon(req, res, fnName, label, makeUrl);
});

exports.getToughieCrossword = onRequest(opts, async (req, res) => {
  const fnName = "getToughieCrossword";
  const label = "toughie crossword";
  const makeUrl = (id) =>
    `${PUZZLESDATA_URL}/puzzles/toughie-crossword/toughie-crossword-${id}.json`;
  await getCommon(req, res, fnName, label, makeUrl);
});

exports.getPrizeCryptic = onRequest(opts, async (req, res) => {
  const fnName = "getPrizeCryptic";
  const label = "prize cryptic";
  const makeUrl = (id) =>
    `${PUZZLESDATA_URL}/puzzles/prize-cryptic/prize-cryptic-${id}.json`;
  await getCommon(req, res, fnName, label, makeUrl);
});

exports.getPrizeToughie = onRequest(opts, async (req, res) => {
  const fnName = "getPrizeToughie";
  const label = "prize toughie";
  const makeUrl = (id) =>
    `${PUZZLESDATA_URL}/puzzles/prize-toughie/prize-toughie-${id}.json`;
  await getCommon(req, res, fnName, label, makeUrl);
});
