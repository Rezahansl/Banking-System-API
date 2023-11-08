const { PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

module.exports = {
    registerUser: async(req, res) => {
        try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user =  await prisma.users.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password : hashedPassword,
                profile : {
                    create:{
                        identity_number: req.body.identity_number,
                        identity_type: req.body.identity_type,
                        address: req.body.address,
                    }
                }
            }
        });
        return res.json({
            data: user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error Register!!!' });
        }
    },
    getUsers: async (req, res) => {
        try {
          const users = await prisma.users.findMany({
            include: {
              profile: true,
            },
          });
          return res.json({
            data: users,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error fetching users!' });
        }
      },
      getUserById: async (req, res) => {
        const userId = parseInt(req.params.userId);
    
        try {
          const user = await prisma.users.findUnique({
            where: {
              id: userId,
            },
            include: {
              profile: true,
            },
          });
    
          if (!user) {
            return res.status(404).json({ error: 'User not found!' });
          }
    
          return res.json({
            data: user,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error fetching user details!' });
        }
      },

      updateProfile: async (req, res) => {
        try {
          const userId = parseInt(req.params.userId);
          const { name, email, identity_number, identity_type, address } = req.body;
      
          let updatedUserData = {};
      
          if (name) {
            updatedUserData.name = name;
          }
          if (email) {
            updatedUserData.email = email;
          }
          if (identity_number || identity_type || address) {
            updatedUserData.profile = {
              upsert: {
                where: {
                  user_id: userId,
                },
                update: {
                  identity_number,
                  identity_type,
                  address,
                },
                create: {
                  identity_number,
                  identity_type,
                  address,
                },
              },
            };
          }
      
          const updatedUser = await prisma.users.update({
            where: {
              id: userId,
            },
            data: updatedUserData,
            include: {
              profile: true,
            },
          });
      
          return res.json({
            data: updatedUser,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error updating user properties!' });
        }
      },
      
      
      
      updatePassword: async (req, res) => {
        try {
          const userId = parseInt(req.params.userId);
          const { newPassword, oldPassword } = req.body;
      
          const user = await prisma.users.findUnique({
            where: {
              id: userId,
            },
          });
          const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ error: 'Old password is incorrect' });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const updatedUser = await prisma.users.update({
            where: {
              id: userId,
            },
            data: {
              password: hashedPassword,
            },
          });
      
          return res.json({
            data: updatedUser,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error updating password!' });
        }
      },

      deleteUserById: async (req, res) => {
        const userId = parseInt(req.params.userId);
      
        try {
          await prisma.users.delete({
            where: {
              id: userId,
            },
            include: {
              profile: true,
            },
          });
      
          return res.json({
            message: 'User deleted successfully',
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error deleting user!' });
        }
      },      
    };