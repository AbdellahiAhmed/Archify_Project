import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Informatique de Gestion' },
      update: {},
      create: { name: 'Informatique de Gestion' }
    }),
    prisma.department.upsert({
      where: { name: 'Gestion' },
      update: {},
      create: { name: 'Gestion' }
    }),
    prisma.department.upsert({
      where: { name: 'Comptabilité' },
      update: {},
      create: { name: 'Comptabilité' }
    }),
    prisma.department.upsert({
      where: { name: 'Marketing' },
      update: {},
      create: { name: 'Marketing' }
    })
  ]);

  console.log('✅ Departments created');

  // Create subscription plans
  const plans = await Promise.all([
    prisma.subscriptionPlan.upsert({
      where: { id: 'free-plan' },
      update: {},
      create: {
        id: 'free-plan',
        name: 'Gratuit',
        description: 'Accès aux cours gratuits uniquement',
        type: 'FULL_ACCESS',
        interval: 'monthly',
        priceCents: 0,
        currency: 'MRU',
        features: [
          'Accès aux cours gratuits',
          'Vidéos de base',
          'Support communautaire'
        ]
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'videos-only' },
      update: {},
      create: {
        id: 'videos-only',
        name: 'Vidéos Seulement',
        description: 'Accès à toutes les vidéos de solutions d\'examens',
        type: 'VIDEOS_ONLY',
        interval: 'yearly',
        priceCents: 65000, // 650 MRU
        currency: 'MRU',
        features: [
          'Accès à toutes les vidéos de solutions',
          'Vidéos HD illimitées',
          'Téléchargements offline',
          'Support prioritaire',
          'Accès pour 1 an complet'
        ]
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'documents-only' },
      update: {},
      create: {
        id: 'documents-only',
        name: 'Documents Seulement',
        description: 'Accès à tous les documents PDF et solutions écrites',
        type: 'DOCUMENTS_ONLY',
        interval: 'yearly',
        priceCents: 50000, // 500 MRU
        currency: 'MRU',
        features: [
          'Accès à tous les documents PDF',
          'Solutions écrites détaillées',
          'Archives d\'examens complets',
          'Téléchargements illimités',
          'Accès pour 1 an complet'
        ]
      }
    }),
    prisma.subscriptionPlan.upsert({
      where: { id: 'full-access' },
      update: {},
      create: {
        id: 'full-access',
        name: 'Accès Complet',
        description: 'Accès à toutes les vidéos ET documents',
        type: 'FULL_ACCESS',
        interval: 'yearly',
        priceCents: 100000, // 1000 MRU
        currency: 'MRU',
        features: [
          'Tout du plan Vidéos',
          'Tout du plan Documents',
          'Accès prioritaire aux nouveaux contenus',
          'Support premium 24/7',
          'Certificats de fin de cours',
          'Accès pour 1 an complet'
        ]
      }
    })
  ]);

  console.log('✅ Subscription plans created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@archify.ma' },
    update: {},
    create: {
      email: 'admin@archify.ma',
      passwordHash: adminPassword,
      name: 'Administrateur Archify',
      role: 'SUPERADMIN',
      departmentId: departments[0].id,
      semester: '1'
    }
  });

  console.log('✅ Admin user created');

  // Create test student
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@archify.ma' },
    update: {},
    create: {
      email: 'student@archify.ma',
      passwordHash: studentPassword,
      name: 'Étudiant Test',
      role: 'STUDENT',
      departmentId: departments[0].id,
      semester: '1'
    }
  });

  console.log('✅ Test student created');

  // Create courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-1' },
      update: {},
      create: {
        id: 'course-1',
        title: 'Introduction à l\'Algorithmique',
        description: 'Découvrez les bases de l\'algorithmique et de la programmation avec des exemples pratiques et des exercices concrets.',
        semester: 'S1',
        professor: 'Prof. Jean Dupont',
        departmentId: departments[0].id,
        tags: ['Algorithmique', 'Programmation', 'Logique'],
        isPremium: true,
        views: 150
      }
    }),
    prisma.course.upsert({
      where: { id: 'course-2' },
      update: {},
      create: {
        id: 'course-2',
        title: 'Analyse Mathématique',
        description: 'Maîtrisez les concepts fondamentaux de l\'analyse mathématique et des fonctions avec des applications pratiques.',
        semester: 'S1',
        professor: 'Prof. Marie Curie',
        departmentId: departments[0].id,
        tags: ['Mathématiques', 'Analyse', 'Fonctions'],
        isPremium: false,
        views: 89
      }
    }),
    prisma.course.upsert({
      where: { id: 'course-3' },
      update: {},
      create: {
        id: 'course-3',
        title: 'Logique et Théorie des Ensembles',
        description: 'Explorez la logique mathématique et les fondements de la théorie des ensembles avec des exemples concrets.',
        semester: 'S2',
        professor: 'Prof. Pierre Fermat',
        departmentId: departments[0].id,
        tags: ['Logique', 'Théorie des Ensembles', 'Mathématiques'],
        isPremium: true,
        views: 67
      }
    }),
    prisma.course.upsert({
      where: { id: 'course-4' },
      update: {},
      create: {
        id: 'course-4',
        title: 'Comptabilité Générale',
        description: 'Apprenez les principes fondamentaux de la comptabilité générale avec des cas pratiques.',
        semester: 'S1',
        professor: 'Prof. Ahmed Benali',
        departmentId: departments[2].id,
        tags: ['Comptabilité', 'Finance', 'Gestion'],
        isPremium: false,
        views: 120
      }
    })
  ]);

  console.log('✅ Courses created');

  // Create lessons for each course
  const lessons = await Promise.all([
    // Course 1 - Algorithmique
    prisma.lesson.upsert({
      where: { id: 'lesson-1-1' },
      update: {},
      create: {
        id: 'lesson-1-1',
        courseId: courses[0].id,
        title: 'Introduction aux algorithmes - Examen 2020',
        type: 'VIDEO',
        durationSec: 1800, // 30 minutes
        vimeoId: '123456789',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 1
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'lesson-1-2' },
      update: {},
      create: {
        id: 'lesson-1-2',
        courseId: courses[0].id,
        title: 'Variables et types de données - Examen 2021',
        type: 'VIDEO',
        durationSec: 2400, // 40 minutes
        vimeoId: '123456790',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 2
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'lesson-1-3' },
      update: {},
      create: {
        id: 'lesson-1-3',
        courseId: courses[0].id,
        title: 'Structures de contrôle - Test 2020',
        type: 'VIDEO',
        durationSec: 2700, // 45 minutes
        vimeoId: '123456791',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 3
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'lesson-1-4' },
      update: {},
      create: {
        id: 'lesson-1-4',
        courseId: courses[0].id,
        title: 'Solutions écrites - Algorithmique 2020',
        type: 'PDF',
        pdfUrl: 'https://example.com/solutions-algorithmique-2020.pdf',
        isPremium: true,
        requiresDocumentSubscription: true,
        orderIndex: 4
      }
    }),

    // Course 2 - Analyse Mathématique
    prisma.lesson.upsert({
      where: { id: 'lesson-2-1' },
      update: {},
      create: {
        id: 'lesson-2-1',
        courseId: courses[1].id,
        title: 'Limites et continuité - Examen 2020',
        type: 'VIDEO',
        durationSec: 2100, // 35 minutes
        vimeoId: '123456792',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 1
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'lesson-2-2' },
      update: {},
      create: {
        id: 'lesson-2-2',
        courseId: courses[1].id,
        title: 'Dérivées - Examen 2021',
        type: 'VIDEO',
        durationSec: 3000, // 50 minutes
        vimeoId: '123456793',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 2
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'lesson-2-3' },
      update: {},
      create: {
        id: 'lesson-2-3',
        courseId: courses[1].id,
        title: 'Solutions écrites - Analyse 2020',
        type: 'PDF',
        pdfUrl: 'https://example.com/solutions-analyse-2020.pdf',
        isPremium: true,
        requiresDocumentSubscription: true,
        orderIndex: 3
      }
    }),

    // Course 3 - Logique
    prisma.lesson.upsert({
      where: { id: 'lesson-3-1' },
      update: {},
      create: {
        id: 'lesson-3-1',
        courseId: courses[2].id,
        title: 'Logique propositionnelle - Test 2020',
        type: 'VIDEO',
        durationSec: 2400, // 40 minutes
        vimeoId: '123456794',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 1
      }
    }),

    // Course 4 - Comptabilité
    prisma.lesson.upsert({
      where: { id: 'lesson-4-1' },
      update: {},
      create: {
        id: 'lesson-4-1',
        courseId: courses[3].id,
        title: 'Principes de la comptabilité - Examen 2020',
        type: 'VIDEO',
        durationSec: 1800, // 30 minutes
        vimeoId: '123456795',
        isPremium: true,
        requiresVideoSubscription: true,
        orderIndex: 1
      }
    })
  ]);

  console.log('✅ Lessons created');

  // Create some comments
  await Promise.all([
    prisma.comment.upsert({
      where: { id: 'comment-1' },
      update: {},
      create: {
        id: 'comment-1',
        lessonId: lessons[0].id,
        userId: student.id,
        content: 'Excellent cours, très bien expliqué !'
      }
    }),
    prisma.comment.upsert({
      where: { id: 'comment-2' },
      update: {},
      create: {
        id: 'comment-2',
        lessonId: lessons[0].id,
        userId: student.id,
        content: 'J\'aimerais plus d\'exemples pratiques dans la prochaine leçon.'
      }
    })
  ]);

  console.log('✅ Comments created');

  // Create a premium subscription for the student
  await prisma.subscription.upsert({
    where: { id: 'sub-1' },
    update: {},
    create: {
      id: 'sub-1',
      userId: student.id,
      planId: plans[1].id, // Premium monthly
      status: 'ACTIVE',
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });

  console.log('✅ Test subscription created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test accounts:');
  console.log('Admin: admin@archify.ma / admin123');
  console.log('Student: student@archify.ma / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
