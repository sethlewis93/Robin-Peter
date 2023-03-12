const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Access hidden files in the .env file
require("dotenv").config();

// Global Vars
const ynabAPIKey = `${process.env.YNAB_TOKEN}`;
const budgetID = `${process.env.DEVELOPER_BUDGET_ID}`;

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${ynabAPIKey}`);

// TODO: Call this function every 2 minutes
async function getTransactionData() {
  const currentMonthTransactions = await fetch(
    `https://api.youneedabudget.com/v1/budgets/${budgetID}/transactions?since_date=2023-03-01`,
    {
      headers: myHeaders,
    }
  )
    .then((res) => res.json())
    .then((result) => result.data.transactions);

  function isClearedTransaction(transaction) {
    return transaction.cleared === "cleared";
  }

  // If the transaction is cleared but has been automated, return true
  function hasBeenAutomated(transactions) {
    return transactions.flag_color === "Automated";
  }

  function getCategory(transactions) {
    return isClearedTransaction(transactions) && !hasBeenAutomated(transactions)
      ? transactions.category_name
      : null;
  }

  // TODO: Perform the calculation on non-food transaction
  function calculateSixPercentSalesFigure(transactions) {
    let sixPercentSalesTaxFigure = [];
    for (let transaction of transactions) {
      if (getCategory(transaction) !== "Groceries") {
        let transactionAmount = Math.abs(transaction.amount);
        function convertAmountToDollars(amount) {
          return Number((Number(amount) / 1000).toFixed(2));
        }
        transactionAmount = convertAmountToDollars(transactionAmount);
        sixPercentSalesTaxFigure.push(
          Number((transactionAmount * 0.06).toFixed(2))
        );
      }
    }
    return sixPercentSalesTaxFigure;
  }

  console.log(calculateSixPercentSalesFigure(currentMonthTransactions));

  // TODO: Check the category's transfer eligibility

  /**
   * Write a function that checks the funds in each transactions non-Grocery category and compares them with the figures in `sixPercentSalesTax..`
   * If the category funds are >= `sixPercentSales...` move the corresponding dollar amount to the 'Uncle Sam' category.
   * Otherwise, don't do anything.
   */

  // TODO: Move the six percent figure to the Uncle Sam Category
}

getTransactionData();
