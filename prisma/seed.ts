import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminEmail = 'admin@nextgen.local';
  const adminPassword = 'Admin123!';
  const azubiEmail = 'azubi@nextgen.local';
  const azubiPassword = 'Azubi123!';
  const ausbildungsbeauftragterEmail = 'ausbildungsbeauftragter@nextgen.local';
  const ausbildungsbeauftragterPassword = 'Betreuer123!';
  const ausbilderEmail = 'ausbilder@nextgen.local';
  const ausbilderPassword = 'Ausbilder123!';
  const hrEmail = 'hr@nextgen.local';
  const hrPassword = 'Hr123!';

  const rolesToCreate = [
    { email: adminEmail, password: adminPassword, firstName: 'System', lastName: 'Admin', role: Role.admin },
    { email: azubiEmail, password: azubiPassword, firstName: 'Max', lastName: 'Mustermann', role: Role.azubi },
    { email: ausbildungsbeauftragterEmail, password: ausbildungsbeauftragterPassword, firstName: 'Julia', lastName: 'Lehrerin', role: Role.ausbildungsbeauftragter },
    { email: ausbilderEmail, password: ausbilderPassword, firstName: 'Thomas', lastName: 'Ausbilder', role: Role.ausbilder },
    { email: hrEmail, password: hrPassword, firstName: 'Sabine', lastName: 'Personal', role: Role.hr },
  ];

  for (const roleData of rolesToCreate) {
    const existing = await prisma.user.findUnique({ where: { email: roleData.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(roleData.password, 12);
      const user = await prisma.user.create({
        data: {
          email: roleData.email,
          passwordHash,
          firstName: roleData.firstName,
          lastName: roleData.lastName,
          roles: { create: [{ role: roleData.role }] },
        },
      });
      console.log(`User angelegt: ${user.email} (${roleData.role})`);
    }
  }

  const defaultBadges = [
    { schluessel: 'punktlich-berichtet', titel: 'Immer pünktlich berichtet', beschreibung: 'Berichtsheft regelmäßig fristgerecht eingereicht', icon: 'pi-clock' },
    { schluessel: 'erstes-zertifikat', titel: 'Erstes Zertifikat', beschreibung: 'Erstes Hersteller-Zertifikat erworben', icon: 'pi-verified' },
    { schluessel: 'ki-kurs-abgeschlossen', titel: 'KI-Kurs abgeschlossen', beschreibung: 'Einen freigegebenen Lernkurs vollständig bearbeitet', icon: 'pi-star' },
  ];

  for (const badge of defaultBadges) {
    await prisma.badge.upsert({
      where: { schluessel: badge.schluessel },
      update: {},
      create: badge,
    });
  }
  console.log('Standard-Badges angelegt');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
