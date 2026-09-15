import { Role as PrismaRole } from '@prisma/client';

export { Role } from '@prisma/client';

export const ALL_ROLES: ReadonlyArray<PrismaRole> = [
  PrismaRole.azubi,
  PrismaRole.ausbildungsbeauftragter,
  PrismaRole.ausbilder,
  PrismaRole.hr,
  PrismaRole.admin,
];

export const ROLE_DESCRIPTIONS: Record<PrismaRole, string> = {
  [PrismaRole.azubi]: 'Azubi (eigene Berichte & Fortschritt)',
  [PrismaRole.ausbildungsbeauftragter]:
    'Ausbildungsbeauftragter (Fachabteilung, betreut Azubis im Einsatz)',
  [PrismaRole.ausbilder]:
    'Ausbilder (Gesamtverantwortlich, finale Freigabe, Versetzung)',
  [PrismaRole.hr]: 'HR / Personalabteilung (Statistik, Verträge, Übernahme)',
  [PrismaRole.admin]: 'Admin (Systemkonfiguration, Rollen/Rechte, Schnittstellen)',
};
