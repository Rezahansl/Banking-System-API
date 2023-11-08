const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  addAccounts: async (req, res) => {
    const userId = parseInt(req.body.userId);
    const { bank_name, bank_account_number, balance } = req.body;

    try {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found!' });
      }
      if (isNaN(balance)) {
        return res.status(400).json({ error: 'Invalid balance value!' });
      }

      const newAccount = await prisma.bank_accounts.create({
        data: {
          bank_name,
          bank_account_number,
          balance: BigInt(balance),
          user: { connect: { id: userId } },
        },
      });

      return res.json({
        data: {
          id: newAccount.id,
          bank_name: newAccount.bank_name,
          bank_account_number: newAccount.bank_account_number,
          balance: Number(newAccount.balance),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error adding account!' });
    }
  },



  getAccounts: async (req, res) => {
    try {
      const accounts = await prisma.bank_accounts.findMany({
        select: {
          id: true,
          bank_name: true,
          bank_account_number: true,
          balance: true,
        },
      });
      const accountsData = accounts.map((account) => ({
        id: account.id,
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: Number(account.balance),
      }));

      return res.json({
        data: accountsData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching accounts!' });
    }
  },

  getAccountById: async (req, res) => {
    const accountId = parseInt(req.params.accountId);

    try {
      const account = await prisma.bank_accounts.findUnique({
        where: {
          id: accountId,
        },
        include: {
          user: true,
        },
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found!' });
      }

      const accountData = {
        id: account.id,
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: Number(account.balance),
        user: account.user,
      };

      return res.json({
        data: accountData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching account details!' });
    }
  },


  updateAccountById: async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    const { bank_name, bank_account_number, balance } = req.body;

    try {

      const existingAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: accountId,
        },
      });

      if (!existingAccount) {
        return res.status(404).json({ error: 'Account not found!' });
      }

      const updatedAccount = await prisma.bank_accounts.update({
        where: {
          id: accountId,
        },
        data: {
          bank_name,
          bank_account_number,
          balance: BigInt(balance), 
        },
      });

      return res.json({
        message: 'Bank account updated successfully',
        data: {
          id: updatedAccount.id,
          bank_name: updatedAccount.bank_name,
          bank_account_number: updatedAccount.bank_account_number,
          balance: Number(updatedAccount.balance),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating bank account!' });
    }
  },

  deleteAccountById: async (req, res) => {
    const accountId = parseInt(req.params.accountId);

    try {
      await prisma.bank_accounts.delete({
        where: {
          id: accountId,
        },
      });

      return res.json({
        message: 'Bank account deleted successfully',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting bank account!' });
    }
  },

};