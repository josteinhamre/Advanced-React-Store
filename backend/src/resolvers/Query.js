const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

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
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    // User permission to view users?
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // Return all users
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
