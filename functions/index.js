/* eslint-env node */

const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");

const { initializeApp } = require("firebase-admin/app");

initializeApp();

// TODO: move this into config of some sort ?
const PUZZLESDATA_URL = "https://puzzlesdata.telegraph.co.uk";

const getCrypticCrossword = async (id) => {
  const url = `${PUZZLESDATA_URL}/puzzles/cryptic-crossword-1/cryptic-crossword-${id}.json`;
  const response = await axios.get(url);
  return { puzData: response.data, puzUrl: url };
};

const getPrizeCryptic = async (id) => {
  const url = `${PUZZLESDATA_URL}/puzzles/prize-cryptic/prize-cryptic-${id}.json`;
  const response = await axios.get(url);
  return { puzData: response.data, puzUrl: url };
};

const opts = { cors: true };

exports.getCrypticCrossword = onRequest(opts, async (req, res) => {
  const id = req.query.id ?? req.body.data.id;
  logger.log("[getCrypticCrossword]", id);
  try {
    const data = await getCrypticCrossword(id);
    res.json({ data });
  } catch (error) {
    if (error?.response?.status === 404) {
      res
        .status(404)
        .send(`Failed to find cryptic crossword with id, "${id}".`);
    } else {
      throw error;
    }
  }
});

exports.getPrizeCryptic = onRequest(opts, async (req, res) => {
  const id = req.query.id ?? req.body.data.id;
  logger.log("[getPrizeCryptic]", id);
  try {
    const data = await getPrizeCryptic(id);
    res.json({ data });
  } catch (error) {
    if (error?.response?.status === 404) {
      res.status(404).send(`Failed to find prize cryptic with id, "${id}".`);
    } else {
      throw error;
    }
  }
});
