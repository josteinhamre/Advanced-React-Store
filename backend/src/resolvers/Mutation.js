const Mutations = {
    
    async createItem(parent, args, ctx, info) {
        // ToDo: Check if they are logged in
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },

    async updateItem(parent, args, ctx, info) {
        // ToDo: Check if they are logged in
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
        const where =  { id: args.id };
        // find the item
        const item = await ctx.db.query.item({ where }, info, `{ id, title }`);
        // check ownership of item/permissions
        // delete it
        return ctx.db.mutation.deleteItem({ where }, info);
    },
};

module.exports = Mutations;