const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Access hidden files in the .env file
require("dotenv").config();

// Global Vars
const ynabAPIKey = `${process.env.YNAB_TOKEN}`;
const budgetID = `${process.env.DEVELOPER_BUDGET_ID}`;

// LISTEN FOR NEW TRANSACTION
/**
 * When a transaction is CLEARED:
 * * that should register an event that acts as the trigger for the workflow below.
 */

// Get the transaction ID
let transactionID = "b073095e-5dc8-40bf-9bfc-9d36925cec51";

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${ynabAPIKey}`);

async function getTransactionData() {
  const transactionData = await fetch(
    `https://api.youneedabudget.com/v1/budgets/${budgetID}/transactions/${transactionID}`,
    {
      headers: myHeaders,
    }
  ).then((res) => res.json());

  let transactionJSON = transactionData.data.transaction;

  function isClearedTransaction(transaction) {
    return transaction.cleared === "cleared";
  }

  // If the transaction is cleared but has been automated, return true
  function hasBeenAutomated(transaction) {
    return transaction.flag_color === "Automated";
  }

  if (
    isClearedTransaction(transactionJSON) &&
    !hasBeenAutomated(transactionJSON)
  ) {
    console.log("Transaction eligible");
  } else {
    console.log("Transaction not eligible");
  }
}

getTransactionData();
