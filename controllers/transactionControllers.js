const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {

  addTransaction: async (req, res) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: { id: source_account_id },
      });

      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: { id: destination_account_id },
      });

      if (!sourceAccount || !destinationAccount) {
        return res.status(404).json({ error: 'One or both accounts not found!' });
      }

      if (sourceAccount.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance in source account!' });
      }

      const transaction = await prisma.$transaction(async (prisma) => {
        const updatedSourceBalance = BigInt(sourceAccount.balance) - BigInt(amount);
        await prisma.bank_accounts.update({
          where: { id: source_account_id },
          data: {
            balance: updatedSourceBalance,
          },
        });

        const updatedDestinationBalance = BigInt(destinationAccount.balance) + BigInt(amount);
        await prisma.bank_accounts.update({
          where: { id: destination_account_id },
          data: {
            balance: updatedDestinationBalance,
          },
        });

        return prisma.bank_account_transactions.create({
          data: {
            source_account_id,
            destination_account_id,
            amount: BigInt(amount),
          },
        });
      });

      return res.json({
        data: {
          source_account_id,
          destination_account_id,
          amount: Number(transaction.amount),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating transaction!' });
    }
  },

  

  getTransactions: async (req, res) => {
    try {
      const transactions = await prisma.bank_account_transactions.findMany();

      const transactionsData = transactions.map((transaction) => ({
        id: transaction.id,
        source_account_id: transaction.source_account_id,
        destination_account_id: transaction.destination_account_id,
        amount: Number(transaction.amount),
      }));

      return res.json({
        data: transactionsData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching all transactions!' });
    }
  },

  getTransactionById: async (req, res) => {

    try {
      const transactionId = parseInt(req.params.transactionId)
      const transaction = await prisma.bank_account_transactions.findUnique({
        where: {
          id: transactionId
        },
        include: {
          source_account: true,
          destination_account: true
        }
      })
      if (!transaction) {
        return res.status(404).json({
          message: `transaction with id ${transactionId} not found`
        })
      }
      transaction.source_account.balance = parseInt(transaction.source_account.balance)
      transaction.destination_account.balance = parseInt(transaction.destination_account.balance)
      transaction.amount = parseInt(transaction.amount)

      return res.status(200).json({
        message: 'get transaction by id success',
        data: transaction
      })
    } catch (error) {
      return res.status(500).json({
        message: 'get transaction by id failed'
      })
    }
  },

  updateTransactionById: async (req, res) => {
    try {
      const transactionId = parseInt(req.params.transactionId);
      const { source_account_id, destination_account_id, amount } = req.body;
      const existingTransaction = await prisma.bank_account_transactions.findUnique({
        where: { id: transactionId },
      });

      if (!existingTransaction) {
        return res.status(404).json({ error: `Transaction with ID ${transactionId} not found!` });
      }

      const updatedTransaction = await prisma.bank_account_transactions.update({
        where: { id: transactionId },
        data: {
          source_account_id,
          destination_account_id,
          amount: BigInt(amount),
        },
      });

      return res.json({
        message: 'Transaction updated successfully',
        data: {
          source_account_id,
          destination_account_id,
          amount: Number(updatedTransaction.amount),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating transaction!' });
    }
  },
  deleteTransactionById: async (req, res) => {
    const transactionId = parseInt(req.params.transactionId);
    try {
      await prisma.bank_account_transactions.delete({
        where: {
          id: transactionId,
        },
      });

      return res.json({
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting transaction!' });
    }
  }

};
