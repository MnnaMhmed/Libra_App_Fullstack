import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@libra.com" },
    update: {},
    create: { fullName: "Menna Mohammed", email: "admin@libra.com", passwordHash, role: "ADMINISTRATOR" }
  });

  const publisherData = [
    { name: "Penguin Random House", address: "New York, USA", email: "contact@penguinrandomhouse.com" },
    { name: "Harriman House", address: "Petersfield, UK", email: "info@harriman-house.com" },
    { name: "Prentice Hall", address: "Boston, USA", email: "info@pearson.com" }
  ];
  for (const item of publisherData) {
    const exists = await prisma.publisher.findFirst({ where: { name: item.name } });
    if (!exists) await prisma.publisher.create({ data: item });
  }

  const authorData = [
    ["James Clear", "Writer and speaker focused on habits and continuous improvement."],
    ["Morgan Housel", "Partner at The Collaborative Fund and author."],
    ["Robert C. Martin", "Software engineer and author known as Uncle Bob."],
    ["Paulo Coelho", "Brazilian lyricist and novelist."],
    ["Cal Newport", "Computer science professor and author."],
    ["Don Norman", "Researcher and author in design and usability."]
  ];
  for (const [name, biography] of authorData) {
    if (!(await prisma.author.findFirst({ where: { name } }))) await prisma.author.create({ data: { name, biography } });
  }

  const categoryNames = ["Self Development", "Finance", "Technology", "Fiction"];
  for (const name of categoryNames) {
    if (!(await prisma.category.findUnique({ where: { name } }))) await prisma.category.create({ data: { name } });
  }

  const memberData = [
    ["Sarah", "Ahmed", "sarah.ahmed@example.com", "+20 100 123 4567", "ACTIVE"],
    ["Omar", "Khaled", "omar.k@example.com", "+20 111 234 5678", "ACTIVE"],
    ["Mariam", "Hassan", "mariam.h@example.com", "+20 122 345 6789", "ACTIVE"],
    ["Youssef", "Ali", "youssef.a@example.com", "+20 101 456 7890", "INACTIVE"]
  ];
  for (const [firstName, lastName, email, phoneNumber, status] of memberData) {
    await prisma.member.upsert({ where: { email }, update: {}, create: { firstName, lastName, email, phoneNumber, status } });
  }

  const authors = await prisma.author.findMany();
  const publishers = await prisma.publisher.findMany();
  const categories = await prisma.category.findMany();
  const books = [
    ["Atomic Habits", "9780735211292", 2018, 0, 0, 0, "An easy and proven way to build good habits and break bad ones."],
    ["The Psychology of Money", "9780857197689", 2020, 1, 1, 1, "Timeless lessons on wealth, greed, and happiness."],
    ["Clean Code", "9780132350884", 2008, 2, 2, 2, "A handbook of agile software craftsmanship."],
    ["The Alchemist", "9780062315007", 1988, 3, 0, 3, "A journey about listening to your heart and following your dreams."],
    ["Deep Work", "9781455586691", 2016, 4, 1, 0, "Rules for focused success in a distracted world."],
    ["The Design of Everyday Things", "9780465050659", 2013, 5, 2, 2, "A powerful primer on how design serves people."]
  ];
  for (const [title, isbn, publicationYear, ai, pi, ci, summary] of books) {
    const exists = await prisma.book.findUnique({ where: { isbn } });
    if (!exists) {
      const book = await prisma.book.create({
        data: {
          title, isbn, publicationYear, summary, language: "English",
          edition: "1st Edition",
          status: title === "Atomic Habits" || title === "Clean Code" ? "UNAVAILABLE" : "AVAILABLE",
          publisherId: publishers[pi]?.id,
          bookAuthors: { create: [{ authorId: authors[ai].id }] },
          bookCategories: { create: [{ categoryId: categories[ci].id }] }
        }
      });
      if (title === "Atomic Habits" || title === "Clean Code") {
        const member = await prisma.member.findFirst({ orderBy: { id: "asc" } });
        await prisma.borrowing.create({ data: { bookId: book.id, memberId: member.id, borrowDate: new Date(Date.now() - 86400000 * 9), dueDate: new Date(Date.now() + 86400000 * 5) } });
      }
    }
  }
  console.log("Libra seed completed. Admin: admin@libra.com / Admin@123");
}

main().catch(error => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
