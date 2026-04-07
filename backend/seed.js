require("dotenv").config();
const connectDB = require("./config/db");
const Subject = require("./models/Subject");
const Teacher = require("./models/Teacher");

async function seed() {
  await connectDB();

  console.log("🗑️  Clearing old data...");
  await Teacher.deleteMany();
  await Subject.deleteMany();

  console.log("👨‍🏫 Creating teachers...");
  const t1 = await Teacher.create({ name: "Dr. Sharma",  email: "sharma@college.com", subjects: ["Mathematics"] });
  const t2 = await Teacher.create({ name: "Prof. Kaur",  email: "kaur@college.com",   subjects: ["Physics"] });
  const t3 = await Teacher.create({ name: "Mr. Verma",   email: "verma@college.com",  subjects: ["CS Fundamentals"] });
  const t4 = await Teacher.create({ name: "Ms. Singh",   email: "singh@college.com",  subjects: ["English"] });

  console.log("📚 Creating subjects...");
  await Subject.create([
    { name: "Mathematics",     code: "MATH101", hoursPerWeek: 5, requiresLab: false, teacher: t1._id },
    { name: "Physics",         code: "PHY101",  hoursPerWeek: 4, requiresLab: false, teacher: t2._id },
    { name: "CS Fundamentals", code: "CS101",   hoursPerWeek: 4, requiresLab: true,  teacher: t3._id },
    { name: "English",         code: "ENG101",  hoursPerWeek: 3, requiresLab: false, teacher: t4._id },
  ]);

  console.log("✅ Seed complete! 4 teachers + 4 subjects added.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});