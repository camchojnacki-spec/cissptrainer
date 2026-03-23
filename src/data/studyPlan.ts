import type { StudyDay } from '../types/study';

export const STUDY_PLAN: StudyDay[] = [
  // Week 1-2: Domain 1 - Security and Risk Management (15%)
  { day: 1, domain: 1, title: 'CIA Triad & Security Governance', tasks: ['Study CIA Triad concepts', 'Review security governance principles', 'Complete 10 practice questions'], hours: 2 },
  { day: 2, domain: 1, title: 'Legal & Regulatory Frameworks', tasks: ['Study GDPR, HIPAA, SOX', 'Review compliance requirements', 'Complete 10 practice questions'], hours: 2 },
  { day: 3, domain: 1, title: 'Risk Management Fundamentals', tasks: ['Learn quantitative risk analysis (SLE, ALE, ARO)', 'Study qualitative risk analysis', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 4, domain: 1, title: 'Security Policies & Frameworks', tasks: ['Study policy hierarchy (policies, standards, procedures, guidelines)', 'Review security frameworks (NIST, ISO 27001)', 'Complete 10 practice questions'], hours: 2 },
  { day: 5, domain: 1, title: 'BCP & DRP Introduction', tasks: ['Study BIA process', 'Learn BCP lifecycle phases', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 6, domain: 1, title: 'Threat Modeling & Ethics', tasks: ['Study STRIDE, PASTA, DREAD', 'Memorize ISC² Code of Ethics', 'Complete 15 practice questions'], hours: 2 },
  { day: 7, domain: 1, title: 'Domain 1 Review & Mini Exam', tasks: ['Review all Domain 1 notes', 'Take a 25-question domain quiz', 'Identify weak areas'], hours: 2 },

  // Week 2: Domain 2 - Asset Security (10%)
  { day: 8, domain: 2, title: 'Data Classification & Ownership', tasks: ['Study government and commercial classification schemes', 'Learn data roles (owner, custodian, processor)', 'Complete 10 practice questions'], hours: 2 },
  { day: 9, domain: 2, title: 'Privacy & Data Protection', tasks: ['Study PII, PHI protection requirements', 'Review privacy regulations', 'Complete 10 practice questions'], hours: 2 },
  { day: 10, domain: 2, title: 'Data Lifecycle & Sanitization', tasks: ['Study data states (at rest, in transit, in use)', 'Learn sanitization methods (NIST 800-88)', 'Complete 10 practice questions'], hours: 2 },
  { day: 11, domain: 2, title: 'Domain 2 Review', tasks: ['Review all Domain 2 material', 'Take a 15-question domain quiz', 'Study data remanence concepts'], hours: 1.5 },

  // Week 3: Domain 3 - Security Architecture & Engineering (13%)
  { day: 12, domain: 3, title: 'Security Models', tasks: ['Study Bell-LaPadula model', 'Study Biba model', 'Compare models - focus on rules'], hours: 2.5 },
  { day: 13, domain: 3, title: 'Security Design Principles', tasks: ['Study least privilege, defense in depth, separation of duties', 'Review trusted computing base', 'Complete 10 practice questions'], hours: 2 },
  { day: 14, domain: 3, title: 'Cryptography Fundamentals', tasks: ['Study symmetric vs asymmetric encryption', 'Learn key algorithms (AES, RSA, ECC)', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 15, domain: 3, title: 'PKI & Certificates', tasks: ['Study PKI components', 'Learn certificate lifecycle', 'Study CRL and OCSP'], hours: 2 },
  { day: 16, domain: 3, title: 'Physical Security', tasks: ['Study site design and facility security', 'Review physical access controls', 'Complete 10 practice questions'], hours: 1.5 },
  { day: 17, domain: 3, title: 'Common Criteria & Evaluation', tasks: ['Study Common Criteria EAL levels', 'Review TCSEC concepts', 'Complete 15 practice questions'], hours: 2 },
  { day: 18, domain: 3, title: 'Domain 3 Review & Mini Exam', tasks: ['Review cryptography formulas and models', 'Take a 20-question domain quiz', 'Focus on security models comparison'], hours: 2 },

  // Week 4: Domain 4 - Communication & Network Security (13%)
  { day: 19, domain: 4, title: 'OSI & TCP/IP Models', tasks: ['Memorize 7 OSI layers', 'Map protocols to layers', 'Complete 10 practice questions'], hours: 2 },
  { day: 20, domain: 4, title: 'Network Devices & Security', tasks: ['Study firewall types', 'Learn IDS/IPS concepts', 'Review network segmentation'], hours: 2 },
  { day: 21, domain: 4, title: 'Secure Protocols', tasks: ['Study TLS/SSL handshake', 'Learn IPSec (AH, ESP, transport vs tunnel)', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 22, domain: 4, title: 'Network Attacks', tasks: ['Study common network attacks', 'Review countermeasures', 'Complete 10 practice questions'], hours: 2 },
  { day: 23, domain: 4, title: 'Wireless & DNS Security', tasks: ['Study WPA3, 802.1X', 'Learn DNSSEC, DoH, DoT', 'Review email security (SPF, DKIM, DMARC)'], hours: 2 },
  { day: 24, domain: 4, title: 'Domain 4 Review & Mini Exam', tasks: ['Review OSI model thoroughly', 'Take a 20-question domain quiz', 'Draw protocol/layer mapping from memory'], hours: 2 },

  // Week 5: Domain 5 - IAM (13%)
  { day: 25, domain: 5, title: 'Authentication Concepts', tasks: ['Study authentication factors', 'Learn MFA and biometrics', 'Complete 10 practice questions'], hours: 2 },
  { day: 26, domain: 5, title: 'Access Control Models', tasks: ['Study DAC, MAC, RBAC, ABAC', 'Compare models and use cases', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 27, domain: 5, title: 'SSO & Federation', tasks: ['Study Kerberos flow', 'Learn SAML, OAuth 2.0, OIDC', 'Complete 10 practice questions'], hours: 2 },
  { day: 28, domain: 5, title: 'Identity Lifecycle', tasks: ['Study provisioning and deprovisioning', 'Learn about privilege creep', 'Review access reviews'], hours: 1.5 },
  { day: 29, domain: 5, title: 'Domain 5 Review & Mini Exam', tasks: ['Review all access control models', 'Take a 20-question domain quiz', 'Practice Kerberos flow diagram'], hours: 2 },

  // Week 6: Domain 6 & 7
  { day: 30, domain: 6, title: 'Assessment Strategies', tasks: ['Study vulnerability assessments vs penetration tests', 'Learn testing methodologies', 'Complete 10 practice questions'], hours: 2 },
  { day: 31, domain: 6, title: 'Auditing & SOC Reports', tasks: ['Study SOC 1, 2, 3 reports', 'Learn audit types', 'Complete 10 practice questions'], hours: 2 },
  { day: 32, domain: 6, title: 'Software Testing', tasks: ['Study SAST, DAST, IAST, fuzzing', 'Review code review processes', 'Complete 10 practice questions'], hours: 2 },
  { day: 33, domain: 6, title: 'Domain 6 Review', tasks: ['Review all assessment types', 'Take a 15-question domain quiz', 'Study KPIs and KRIs'], hours: 1.5 },
  { day: 34, domain: 7, title: 'Incident Response', tasks: ['Study IR lifecycle (NIST 800-61)', 'Learn containment strategies', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 35, domain: 7, title: 'Digital Forensics', tasks: ['Study evidence types and handling', 'Learn chain of custody', 'Complete 10 practice questions'], hours: 2 },
  { day: 36, domain: 7, title: 'Disaster Recovery', tasks: ['Study DR site types', 'Learn recovery metrics (RPO, RTO, MTD)', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 37, domain: 7, title: 'Security Operations', tasks: ['Study SIEM, logging, monitoring', 'Learn change management', 'Review patch management'], hours: 2 },
  { day: 38, domain: 7, title: 'Domain 7 Review & Mini Exam', tasks: ['Review IR phases and evidence handling', 'Take a 20-question domain quiz', 'Practice recovery metric calculations'], hours: 2 },

  // Week 7: Domain 8 + Cross-domain review
  { day: 39, domain: 8, title: 'Secure SDLC', tasks: ['Study SDLC phases and security integration', 'Learn DevSecOps concepts', 'Complete 10 practice questions'], hours: 2 },
  { day: 40, domain: 8, title: 'OWASP Top 10', tasks: ['Study all OWASP Top 10 vulnerabilities', 'Learn prevention techniques', 'Complete 10 practice questions'], hours: 2.5 },
  { day: 41, domain: 8, title: 'Database & Software Security', tasks: ['Study ACID, normalization', 'Learn about buffer overflows, race conditions', 'Complete 10 practice questions'], hours: 2 },
  { day: 42, domain: 8, title: 'Domain 8 Review', tasks: ['Review OWASP Top 10', 'Take a 15-question domain quiz', 'Study secure coding practices'], hours: 1.5 },

  // Week 8: Comprehensive Review
  { day: 43, domain: null, title: 'Domains 1-2 Deep Review', tasks: ['Review weak areas from domain quizzes', 'Re-study risk formulas', 'Take 30-question mixed quiz'], hours: 3 },
  { day: 44, domain: null, title: 'Domains 3-4 Deep Review', tasks: ['Review crypto algorithms and models', 'Re-study OSI model and protocols', 'Take 30-question mixed quiz'], hours: 3 },
  { day: 45, domain: null, title: 'Domains 5-6 Deep Review', tasks: ['Review access control models', 'Re-study assessment types', 'Take 30-question mixed quiz'], hours: 3 },
  { day: 46, domain: null, title: 'Domains 7-8 Deep Review', tasks: ['Review IR and forensics', 'Re-study SDLC and OWASP', 'Take 30-question mixed quiz'], hours: 3 },

  // Week 9: Practice Exams
  { day: 47, domain: null, title: 'Full Practice Exam #1', tasks: ['Take full-length practice exam (80 questions)', 'Review incorrect answers', 'Note weak domains'], hours: 4 },
  { day: 48, domain: null, title: 'Practice Exam #1 Review', tasks: ['Deep dive into missed questions', 'Study explanations thoroughly', 'Create flash cards for weak areas'], hours: 3 },
  { day: 49, domain: null, title: 'Full Practice Exam #2', tasks: ['Take full-length practice exam (80 questions)', 'Focus on previously weak areas', 'Review all answers'], hours: 4 },
  { day: 50, domain: null, title: 'Practice Exam #2 Review', tasks: ['Analyze performance trends', 'Focus study on remaining weak areas', 'Review key formulas and concepts'], hours: 3 },

  // Week 9-10: Final Prep
  { day: 51, domain: null, title: 'Weak Areas Targeted Study', tasks: ['Focus exclusively on weakest domains', 'Complete targeted practice questions', 'Review study notes'], hours: 3 },
  { day: 52, domain: null, title: 'Full Practice Exam #3', tasks: ['Take final full-length practice exam', 'Aim for 80%+ score', 'Review and document remaining gaps'], hours: 4 },
  { day: 53, domain: null, title: 'Cryptography & Models Review', tasks: ['Final review of all crypto algorithms', 'Review all security models', 'Practice key calculations'], hours: 2.5 },
  { day: 54, domain: null, title: 'Legal, Compliance & Ethics Review', tasks: ['Final review of legal frameworks', 'Re-read ISC² Code of Ethics', 'Review compliance requirements'], hours: 2 },
  { day: 55, domain: null, title: 'Network & IAM Final Review', tasks: ['Final review of OSI model', 'Review all access control models', 'Practice Kerberos and federation flows'], hours: 2.5 },
  { day: 56, domain: null, title: 'Operations & Development Review', tasks: ['Final review of IR and DR', 'Review OWASP and SDLC', 'Complete 20 practice questions'], hours: 2.5 },
  { day: 57, domain: null, title: 'Formula & Acronym Review', tasks: ['Review all risk formulas', 'Practice all acronyms', 'Quick-fire concept review'], hours: 2 },
  { day: 58, domain: null, title: 'Full Practice Exam #4 (Final)', tasks: ['Take final practice exam under exam conditions', 'Review only incorrect answers', 'Confidence check'], hours: 4 },
  { day: 59, domain: null, title: 'Light Review & Rest', tasks: ['Light review of key concepts only', 'Organize exam day logistics', 'Get good sleep - no heavy studying'], hours: 1 },
  { day: 60, domain: null, title: 'Exam Day Prep', tasks: ['Review ISC² Code of Ethics one last time', 'Review top 10 most-missed concepts', 'Relax and stay confident - you are ready!'], hours: 1 },
];
