const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
        },
      },
      info
    );

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, info, `{ id, title }`);
    // check ownership of item/permissions
    // delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // Hash their password
    const password = await bcrypt.hash(args.password, 10);
    // Create user in DB
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set JWT token as cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    email = email.toLowerCase();
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set JWT token as cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  async requestReset(parent, { email }, ctx, info) {
    // Check if user exists
    email = email.toLowerCase();
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for ${email}`);
    }
    // Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 Hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    // Email the token to user
    const mailRes = await transport.sendMail({
      from: 'josteinhamre@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token.',
      html: makeANiceEmail(
        `Your Password Reset Token is her! \n\n <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>Click here to reset </a>`
      ),
    });

    return { message: 'Thanks!' };
  },

  async resetPassword(parent, args, ctx, info) {
    // Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error(`Passwords do not match`);
    }
    // Check if token is correct
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now(),
      },
    });
    if (!user) {
      throw new Error(`Token is not valid or expired.`);
    }
    // Hash their password
    const password = await bcrypt.hash(args.password, 10);
    // Create user in DB
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email,
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // Create JWT token
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // Set JWT token as cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // User logged in?
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    // Has permissions to update permissions
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
};

module.exports = Mutations;
