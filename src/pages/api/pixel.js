import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    // get all pixels from prisma db
    const pixels = await prisma.pixel.findMany();
    res.status(200).json(pixels);
}