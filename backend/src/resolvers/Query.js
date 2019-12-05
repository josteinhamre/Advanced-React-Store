const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

function userLoggedIn(ctx) {
  const { userId } = ctx.request;
  if (!userId) throw new Error('You must be logged in perform this action!');
  return userId;
}

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // User logged in?
    userLoggedIn(ctx);
    // User permission to view users?
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // Return all users
    return ctx.db.query.users({}, info);
  },
  async order(parents, args, ctx, info) {
    const userId = userLoggedIn(ctx);
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );

    const ownsOrder = order.user.id === userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN'
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You don't have permissions to see this order!");
    }
    return order;
  },

  async orders(parent, args, ctx, info) {
    // User logged in?
    const userId = userLoggedIn(ctx);
    // Return all orders for this user
    return ctx.db.query.orders(
      {
        where: {
          user: { id: userId },
        },
      },
      info
    );
  },
};

module.exports = Query;
