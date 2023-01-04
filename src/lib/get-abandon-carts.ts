import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllAbandonCart = async () => {
    let orders = await prisma.order.findMany();
    let notAbandoncart: string[] = [];
    for(const order of orders) {
        notAbandoncart.push(order.cart_id || "");
    }
    return await prisma.cart.findMany({where: {id: {notIn: notAbandoncart}}});
}