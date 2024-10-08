const Account = require("../../models/accounts/accountmodel");
const Transaction = require("../../models/transcations/transcationmodel");
const User = require("../../models/users/usermodel");
const { AppErr } = require("../../utils/apperr");

//create
const createTransactionCtrl = async (req, res, next) => {
  const { title, amount, notes, transactionType, account, category } = req.body;
  try {
    //1. Find user
    const userFound = await User.findById(req.user);
    if (!userFound) return next(new AppErr("User not found", 404));
    //2.find the account
    const accountFound = await Account.findById(account);
    if (!accountFound) return next(new AppErr("Account not found", 404));
    //3. Create the transaction
    const transaction = await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      title,
      createdBy: req.user,
    });
    //4. Push the transaction to the account
    accountFound.transactions.push(transaction._id);
    //5. resave the account
    await accountFound.save();

    res.json({ status: "succes", data: transaction });
  } catch (error) {
    res.json(error);
  }
};

//all
const getTransactionsCtrl = async (req, res, next) => {
  try {
    const trans = await Transaction.find();
    res.status(200).json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//single
const getTransactionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const tran = await Transaction.findById(id);
    res.json({ status: "success", data: tran });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//delete
const deleteTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//update
const updateTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tran = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({
      status: "success",
      data: tran,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getTransactionsCtrl,
  getTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};

