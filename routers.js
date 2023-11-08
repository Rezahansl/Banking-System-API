const express = require('express')
const userControllers = require('./controllers/userControllers')
const accountControllers = require('./controllers/accountControllers')
const transactionControllers = require('./controllers/transactionControllers')
const router = express.Router()

router.get('/', (req,res) => {
    return res.json({
        message: "Reza Hans Latif"
    })
})

router.post('/users', userControllers.registerUser)
router.get('/users', userControllers.getUsers)
router.get('/users/:userId', userControllers.getUserById)
router.put('/users/:userId/update-profile', userControllers.updateProfile)
router.put('/users/:userId/update-password', userControllers.updatePassword)
router.delete('/users/:userId', userControllers. deleteUserById)
router.post('/accounts', accountControllers.addAccounts)
router.get('/accounts', accountControllers.getAccounts)
router.get('/accounts/:accountId', accountControllers.getAccountById);
router.delete('/accounts/:accountId', accountControllers. deleteAccountById);
router.put('/accounts/:accountId', accountControllers.updateAccountById);
router.post('/transactions', transactionControllers.addTransaction)
router.get('/transactions', transactionControllers.getTransactions)
router.get('/transactions/:transactionId', transactionControllers.getTransactionById); 
router.delete('/transactions/:transactionId', transactionControllers.deleteTransactionById); 
router.put('/transactions/:transactionId', transactionControllers.updateTransactionById); 


module.exports = router