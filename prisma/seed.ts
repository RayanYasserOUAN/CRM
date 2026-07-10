import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash("admin123", 10)
  await db.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: hashed, name: "Admin" },
  })

  const contacts = await Promise.all([
    db.contact.create({ data: { name: "Alice Johnson", email: "alice@techcorp.com", phone: "+1 (555) 123-4567", company: "TechCorp", status: "Active" } }),
    db.contact.create({ data: { name: "Bob Martinez", email: "bob@innovate.io", phone: "+1 (555) 234-5678", company: "Innovate.io", status: "Active" } }),
    db.contact.create({ data: { name: "Carol Chen", email: "carol@buildlab.co", phone: "+1 (555) 345-6789", company: "BuildLab", status: "Lead" } }),
    db.contact.create({ data: { name: "David Kim", email: "david@nexus.com", phone: "+1 (555) 456-7890", company: "Nexus Systems", status: "Active" } }),
    db.contact.create({ data: { name: "Eva Larsson", email: "eva@nordictech.se", phone: "+46 70 123 45 67", company: "Nordic Tech", status: "Active" } }),
    db.contact.create({ data: { name: "Frank Okafor", email: "frank@africanli.com", phone: "+234 801 234 5678", company: "Africanli", status: "Inactive" } }),
    db.contact.create({ data: { name: "Grace Patel", email: "grace@dataview.com", phone: "+1 (555) 567-8901", company: "DataView", status: "Active" } }),
    db.contact.create({ data: { name: "Henry Thompson", email: "henry@greenfield.org", phone: "+1 (555) 678-9012", company: "Greenfield Org", status: "Lead" } }),
    db.contact.create({ data: { name: "Iris Nakamura", email: "iris@tokyotech.jp", phone: "+81 90 1234 5678", company: "Tokyo Tech", status: "Active" } }),
    db.contact.create({ data: { name: "Jake Williams", email: "jake@solveit.com", phone: "+1 (555) 789-0123", company: "SolveIt", status: "Active" } }),
  ])

  const dealsData = [
    { title: "Enterprise SaaS Deal", value: 45000, stage: "Proposal", contactId: contacts[0].id },
    { title: "Cloud Migration Package", value: 28000, stage: "Contacted", contactId: contacts[1].id },
    { title: "Data Analytics Platform", value: 12000, stage: "Lead", contactId: contacts[2].id },
    { title: "Infrastructure Upgrade", value: 75000, stage: "Won", contactId: contacts[3].id },
    { title: "Security Audit Contract", value: 15000, stage: "Contacted", contactId: contacts[4].id },
    { title: "Mobile App Development", value: 35000, stage: "Proposal", contactId: contacts[6].id },
    { title: "Consulting Engagement", value: 22000, stage: "Lost", contactId: contacts[8].id },
    { title: "DevOps Setup", value: 18000, stage: "Lead", contactId: contacts[9].id },
  ]

  await Promise.all(
    dealsData.map((d) => db.deal.create({ data: d }))
  )

  console.log("Seed complete: 1 user, 10 contacts, 8 deals")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
