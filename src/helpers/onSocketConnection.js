import { prisma } from '@/lib/prisma'

export default (io, socket) => {
    const createdPixel = async (pixel) => {
        console.log("server: createdPixel", pixel);
        // save pixel to db
        let res = await prisma.pixel.upsert({
            where: { id: pixel.x.toString() + "-" + pixel.y.toString() },
            update: {
                color: pixel.color,
            },
            create: {
                id: pixel.x.toString() + "-" + pixel.y.toString(),
                color: pixel.color
            }
        });
        console.log(res);
        socket.broadcast.emit("newIncomingPixel", pixel);
    }

    socket.on("createdPixel", createdPixel);
};