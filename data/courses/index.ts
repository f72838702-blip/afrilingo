// AfriLingo — registre des cours.
// Pour AJOUTER un cours : crée `data/courses/<id>.ts` qui exporte un `Course`,
// puis ajoute-le à ce tableau. AUCUNE autre modification de code nécessaire —
// le catalogue, le skill-tree, les leçons et la progression le prennent en charge
// automatiquement (illimité).
//
// Contraintes :
//  - `course_id` unique.
//  - Les ids de leçons doivent être GLOBALEMENT uniques (tous cours confondus),
//    car la progression est un flat `completedLessons: string[]` et le routage
//    est `/lesson/[id]` (résolution du cours par id de leçon).

import type { Course } from "@/types";
import { FR_NKO_COURSE } from "./fr-nko";
import { FR_NKO_NUMBERS_COURSE } from "./fr-nko-numbers";

export const COURSES_REGISTRY: Course[] = [
  FR_NKO_COURSE,
  FR_NKO_NUMBERS_COURSE,
];