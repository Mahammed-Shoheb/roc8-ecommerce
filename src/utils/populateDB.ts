import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function main() {
  console.log("start");
  for (let i = 0; i < 100; i++) {
    try {
      await prisma.category.create({
        data: {
          name: faker.commerce.productName(),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  console.log("done");
}

await main();
