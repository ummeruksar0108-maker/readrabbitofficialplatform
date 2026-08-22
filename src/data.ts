import { Course, StudyMaterial, Unit } from "./types";

export const initialCourses: Course[] = [
  {
    "id": "aiml",
    "name": "BCA AI/ML",
    "description": "Bachelor of Computer Applications in Artificial Intelligence & Machine Learning",
    "semesters": [
      {
        "id": 1,
        "name": "Semester 1",
        "description": "Discrete Structure, Problem Solving Technique, Computer Architecture, Labs, Languages, and Constitution of India",
        "status": "In Progress",
        "modulesCount": 20,
        "completedModules": 14,
        "progressPercent": 70,
        "borderClass": "border-[#fd9b65]",
        "badgeBg": "bg-[#fff2e1] text-[#95491a]",
        "badgeText": "Current",
        "icon": "BookOpen",
        "subjects": [
          {
            "id": "discrete_structure",
            "name": "Discrete Structure",
            "description": "Set theory, logic, counting, matrices, and graph theory.",
            "modulesCount": 4,
            "completedModules": 4,
            "difficulty": "Core",
            "icon": "Binary",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 100,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Discrete Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_u1",
                "number": "01",
                "name": "Unit 1: Set Theory",
                "description": "Set theory principles and relations.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Sets and Subsets",
                  "Venn Diagrams",
                  "Set Operations",
                  "Cartesian Products",
                  "Relations and Functions"
                ]
              },
              {
                "id": "ds_u2",
                "number": "02",
                "name": "Unit 2: Logic and Counting",
                "description": "Propositional logic and counting techniques.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Propositional Logic",
                  "Truth Tables",
                  "Tautologies",
                  "Permutations",
                  "Combinations",
                  "Pigeonhole Principle"
                ]
              },
              {
                "id": "ds_u3",
                "number": "03",
                "name": "Unit 3: Matrices",
                "description": "Matrix algebra and determinants.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Matrix Operations",
                  "Determinants",
                  "System of Linear Equations",
                  "Eigenvalues",
                  "Eigenvectors",
                  "Cayley-Hamilton Theorem"
                ]
              },
              {
                "id": "ds_u4",
                "number": "04",
                "name": "Unit 4: Graph Theory",
                "description": "Graphs, trees, and paths.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Basic Graph Terminology",
                  "Euler Paths",
                  "Hamiltonian Cycles",
                  "Trees",
                  "Graph Coloring",
                  "Planar Graphs"
                ]
              }
            ],
            "materials": [
              {
                "id": "mat_ds_1",
                "name": "Set Theory & Relations Solved Proofs.pdf",
                "size": "2.1 MB",
                "addedTime": "Added 3 days ago",
                "type": "pdf",
                "isBookmarked": false,
                "tag": "Handwritten",
                "details": "Step-by-step mathematical proofs of power sets, bijection mapping, and equivalence relations."
              },
              {
                "id": "mat_ds_2",
                "name": "Truth Tables & Combinatorics Practice.pdf",
                "size": "1.4 MB",
                "addedTime": "Alumni Resource",
                "type": "pdf",
                "isBookmarked": false,
                "tag": "Must Read",
                "details": "Midterm prep booklet with 45 solved examples of permutations, logic formulas, and quantifiers."
              }
            ]
          },
          {
            "id": "problem_solving",
            "name": "Problem Solving Technique",
            "description": "Algorithms, C programming, factoring methods, searching and sorting.",
            "modulesCount": 4,
            "completedModules": 3,
            "difficulty": "Intermediate",
            "icon": "Braces",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 75,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ps_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Problem Solving Technique Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ps_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Fundamental Algorithms",
                "description": "Fundamental algorithm design.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ps_u2",
                "number": "02",
                "name": "Unit 2: C Programming",
                "description": "C language fundamentals.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ps_u3",
                "number": "03",
                "name": "Unit 3: Factoring Methods & Array Techniques",
                "description": "Factoring techniques and array manipulation.",
                "masteryPercent": 80,
                "status": "In Progress"
              },
              {
                "id": "ps_u4",
                "number": "04",
                "name": "Unit 4: Sorting, Searching & Pattern Searching",
                "description": "Searching and sorting algorithms.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": [
              {
                "id": "mat_ps_1",
                "name": "Interactive Pointer Demos.java",
                "size": "Code File",
                "addedTime": "Lab Practical",
                "type": "code",
                "isBookmarked": false,
                "details": "// C Pointer demonstration\n#include <stdio.h>\nint main() {\n    int value = 42;\n    int *ptr = &value;\n    printf(\"Value: %d\\n\", value);\n    printf(\"Pointer Address: %p\\n\", ptr);\n    printf(\"Deref Pointer: %d\\n\", *ptr);\n    return 0;\n}"
              }
            ]
          },
          {
            "id": "computer_arch",
            "name": "Computer Architecture",
            "description": "Number systems, combinational circuits, computer organization, and 8085 assembly.",
            "modulesCount": 4,
            "completedModules": 2,
            "difficulty": "Core",
            "icon": "Cpu",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 50,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ca_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Computer Architecture Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ca_u1",
                "number": "01",
                "name": "Unit 1: Number Systems & Digital Logic Circuits",
                "description": "Digital logic and number conversions.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ca_u2",
                "number": "02",
                "name": "Unit 2: Combinational Circuits & Digital Components",
                "description": "Logic circuits and components.",
                "masteryPercent": 85,
                "status": "In Progress"
              },
              {
                "id": "ca_u3",
                "number": "03",
                "name": "Unit 3: Basic Computer Organization & CPU",
                "description": "Basic CPU architecture and instructions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ca_u4",
                "number": "04",
                "name": "Unit 4: 8085 Microprocessor & Assembly Language Programming",
                "description": "8085 microprocessor assembly programming.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": [
              {
                "id": "mat_ca_1",
                "name": "K-Map Simplification Guide.pdf",
                "size": "1.8 MB",
                "addedTime": "Added 1 week ago",
                "type": "pdf",
                "isBookmarked": false,
                "details": "Comprehensive guide to 3, 4, and 5 variable K-Maps with grouping and don't care conditions."
              }
            ]
          },
          {
            "id": "ps_lab_sem1",
            "name": "Problem Solving Technique Lab",
            "description": "Practical laboratory for Problem Solving Technique.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ps_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Problem Solving Technique Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ps_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Problem Solving Technique Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ps_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Problem Solving Technique Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ca_lab_sem1",
            "name": "Computer Architecture Lab",
            "description": "Practical laboratory for Computer Architecture.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ca_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Computer Architecture Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ca_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Computer Architecture Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ca_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Computer Architecture Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "oat_lab_sem1",
            "name": "Office Automation Tools Lab",
            "description": "Practical laboratory for Office Automation Tools.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "oat_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Office Automation Tools Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "oat_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Office Automation Tools Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "oat_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Office Automation Tools Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "language_1_sem1",
            "name": "English (Language I)",
            "description": "Semester 1 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "lang1_s1_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "lang1_s1_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s1_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s1_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s1_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "language_2_sem1",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "lang2_s1_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "kan_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "kan_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s1_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "hin_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "hin_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s1_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ae_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ae_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "constitution_of_india",
            "name": "Constitution of India",
            "description": "Preamble, Fundamental Rights, Directive Principles, and Union Executive.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "ShieldAlert",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "coi_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Constitution of India Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "coi_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Framing of Indian Constitution and Preamble.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "coi_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Fundamental Rights and Fundamental Duties.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "coi_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Directive Principles of State Policy.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "coi_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Union Executive and Parliamentary Principles.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 2,
        "name": "Semester 2",
        "description": "Data Structure, OOP using Java, Operating Systems, Labs, Languages, and Environmental Studies",
        "status": "Locked",
        "modulesCount": 20,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "data_structure",
            "name": "Data Structure",
            "description": "Overview, arrays & linked lists, stacks & queues, trees, graphs & hashing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Network",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds2_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Overview",
                "description": "Data structures classification and algorithms analysis.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds2_u2",
                "number": "02",
                "name": "Unit 2: Arrays & Linked Lists",
                "description": "Arrays and linked list representations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds2_u3",
                "number": "03",
                "name": "Unit 3: Stacks & Queues",
                "description": "Stack operations and queue implementations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds2_u4",
                "number": "04",
                "name": "Unit 4: Trees, Graphs & Hashing",
                "description": "Trees, graph algorithms, and hash tables.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "java_programming",
            "name": "Object Oriented Programming using Java",
            "description": "Java introduction, inheritance & polymorphism, event handling & GUI, exception handling & multithreading.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Coffee",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "java_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Object Oriented Programming using Java Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "java_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Java",
                "description": "Java language basics and JVM.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "java_u2",
                "number": "02",
                "name": "Unit 2: Inheritance, Polymorphism, Packages & I/O",
                "description": "Object-oriented principles in Java.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "java_u3",
                "number": "03",
                "name": "Unit 3: Event Handling, GUI, Applets & String Handling",
                "description": "Event-driven programming and GUI design.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "java_u4",
                "number": "04",
                "name": "Unit 4: Exception Handling, Multithreading & Collections",
                "description": "Robust exception handling and multithreading.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "operating_systems",
            "name": "Operating Systems",
            "description": "OS & processes, synchronization & deadlocks, memory management & files, Linux programming.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Settings",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "os2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Operating Systems Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "os2_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Operating Systems & Processes",
                "description": "Process concepts and kernel architectures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "os2_u2",
                "number": "02",
                "name": "Unit 2: Process Synchronization, Scheduling & Deadlocks",
                "description": "CPU scheduling and process locks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "os2_u3",
                "number": "03",
                "name": "Unit 3: Memory Management & File Systems",
                "description": "Virtual memory and file organization.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "os2_u4",
                "number": "04",
                "name": "Unit 4: Linux Programming & Commands",
                "description": "Shell scripting and Linux system tools.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_lab_sem2",
            "name": "Data Structure Lab",
            "description": "Practical laboratory for Data Structure.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Structure Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Structure Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Structure Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "os_lab_sem2",
            "name": "Operating Systems Lab",
            "description": "Practical laboratory for Operating Systems.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "os_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Operating Systems Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "os_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Operating Systems Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "os_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Operating Systems Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "linux_lab_sem2",
            "name": "Linux & Shell Programming Lab",
            "description": "Practical laboratory for Linux & Shell Programming.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-cyan-50 text-cyan-800",
            "textColor": "text-cyan-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "lin_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Linux & Shell Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "lin_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Linux & Shell Programming Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "lin_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Linux & Shell Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "language_1_sem2",
            "name": "English (Language I)",
            "description": "Semester 2 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "lang1_s2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "lang1_s2_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s2_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s2_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s2_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "language_2_sem2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "lang2_s2_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "kan_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "kan_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s2_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "hin_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "hin_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s2_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ae_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ae_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "environmental_studies",
            "name": "Environmental Studies",
            "description": "Ecosystems, biodiversity, pollution, and sustainable development.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Leaf",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "env_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Environmental Studies Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "env_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Ecosystems and natural resources.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "env_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Biodiversity and conservation.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "env_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Environmental pollution and global climate change.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "env_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Sustainable development and environmental ethics.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 3,
        "name": "Semester 3",
        "description": "Database Management System, Python Programming, Algorithms, Feature Engineering, Labs, Languages",
        "status": "Locked",
        "modulesCount": 15,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "dbms_sem3",
            "name": "Database Management System",
            "description": "Fundamentals of database systems, design & storage, relational model & SQL, transactions & PL/SQL.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Database",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "db3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Database Management System Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "db3_u1",
                "number": "01",
                "name": "Unit 1: Fundamentals of Database Systems and Architecture",
                "description": "DBMS architecture and schemas.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "db3_u2",
                "number": "02",
                "name": "Unit 2: Database Design and Storage Structures",
                "description": "ER models, keys, and index structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "db3_u3",
                "number": "03",
                "name": "Unit 3: Relational Model, Normalization and SQL",
                "description": "Normalization rules and SQL queries.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "db3_u4",
                "number": "04",
                "name": "Unit 4: Query Processing, Transactions and PL/SQL",
                "description": "Transactions, locking, and PL/SQL.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "fds_sem3",
            "name": "Foundations of Data Science",
            "description": "Foundations, data acquisition & preprocessing, exploratory data analysis & statistical techniques, regression & predictive modeling.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Brain",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "fds3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Foundations of Data Science Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "fds3_u1",
                "number": "01",
                "name": "Unit 1: Foundations of Data Science and Its Applications",
                "description": "Data science ecosystem, principles, and applications.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "fds3_u2",
                "number": "02",
                "name": "Unit 2: Data Acquisition and Preprocessing Techniques",
                "description": "Data gathering, cleaning, and transformation pipelines.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "fds3_u3",
                "number": "03",
                "name": "Unit 3: Exploratory Data Analysis and Statistical Techniques",
                "description": "EDA methods, summary statistics, and hypothesis testing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "fds3_u4",
                "number": "04",
                "name": "Unit 4: Regression Analysis and Predictive Modeling",
                "description": "Linear/logistic regression and model evaluations.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "python_sem3",
            "name": "Python Programming",
            "description": "Foundations, data structures & files, OOP & data libraries, data analysis & visualization.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Terminal",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "py3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Python Programming Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "py3_u1",
                "number": "01",
                "name": "Unit 1: Foundations of Python Programming",
                "description": "Python syntax and control structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "py3_u2",
                "number": "02",
                "name": "Unit 2: Data Structures and File Handling",
                "description": "Lists, tuples, dictionaries, and file IO.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "py3_u3",
                "number": "03",
                "name": "Unit 3: Object-Oriented Programming and Data Handling Libraries",
                "description": "Classes, NumPy arrays, and Pandas DataFrames.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "py3_u4",
                "number": "04",
                "name": "Unit 4: Data Analysis and Visualization",
                "description": "Matplotlib and Seaborn plotting.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "data_viz_sem3",
            "name": "Data Visualization",
            "description": "Introduction to data visualization & tools, data storytelling & visualization design.",
            "modulesCount": 2,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "BarChart",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "dv3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Visualization Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "dv3_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Data Visualization and Tools",
                "description": "Visual design principles and tools.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dv3_u2",
                "number": "02",
                "name": "Unit 2: Data Storytelling and Visualization Design",
                "description": "Designing effective visual narratives.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "dbms_lab_sem3",
            "name": "DBMS Lab",
            "description": "Practical laboratory for Database Management System.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "db_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "DBMS Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "db_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "DBMS Lab Query Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "db_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "DBMS Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_lab_sem3",
            "name": "Data Science Lab",
            "description": "Practical laboratory for Foundations of Data Science.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Science Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Science Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Science Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "python_lab_sem3",
            "name": "Python Programming Lab",
            "description": "Practical laboratory for Python Programming.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "py_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "Python Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "py_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "Python Programming Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "py_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Python Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "language_1_sem3",
            "name": "English (Language I)",
            "description": "Semester 3 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "lang1_s3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "lang1_s3_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s3_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s3_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s3_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "language_2_sem3",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "lang2_s3_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "kan_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "kan_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s3_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "hin_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "hin_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s3_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ae_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ae_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 4,
        "name": "Semester 4",
        "description": "Artificial Intelligence, Data Analytics, IoT, Data Visualization, Labs, Probability & Stats, Languages",
        "status": "Locked",
        "modulesCount": 18,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ai_sem4",
            "name": "Artificial Intelligence",
            "description": "AI fundamentals & search, knowledge representation & reasoning, planning & perception, ML, neural nets & AI ethics.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "BrainCircuit",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ai4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Artificial Intelligence Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ai4_u1",
                "number": "01",
                "name": "Unit 1: Fundamentals of Artificial Intelligence and Search Techniques",
                "description": "Search algorithms and heuristics.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ai4_u2",
                "number": "02",
                "name": "Unit 2: Knowledge Representation, Reasoning and Learning Paradigms",
                "description": "Knowledge models and inference.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ai4_u3",
                "number": "03",
                "name": "Unit 3: Planning, Reasoning and Perception",
                "description": "Classical planning and computer vision.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ai4_u4",
                "number": "04",
                "name": "Unit 4: Machine Learning, Neural Networks and AI Ethics",
                "description": "Supervised ML, neural nets, and ethics.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "data_analytics_sem4",
            "name": "Data Analytics",
            "description": "Introduction to data analytics, correlation & regression, probability & statistical methods, Power BI.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "PieChart",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "da4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Analytics Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "da4_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Data Analytics",
                "description": "Data analytics lifecycle and concepts.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "da4_u2",
                "number": "02",
                "name": "Unit 2: Correlation & Regression",
                "description": "Correlation analysis and regression models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "da4_u3",
                "number": "03",
                "name": "Unit 3: Probability & Statistical Methods",
                "description": "Statistical testing and hypothesis checks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "da4_u4",
                "number": "04",
                "name": "Unit 4: Power BI",
                "description": "Dashboard design and DAX calculations in Power BI.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "r_prog_sem4",
            "name": "Scientific Programming using R",
            "description": "Introduction to R, utilities & system-level programming, OOP & packages, comparative analysis & applications.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Code",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "r4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Scientific Programming using R Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "r4_u1",
                "number": "01",
                "name": "Unit 1: Introduction to R and Fundamental Programming Constructs",
                "description": "R syntax, vectors, matrices, data frames, and control structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "r4_u2",
                "number": "02",
                "name": "Unit 2: Utilities and System-Level Programming in R",
                "description": "String manipulation, regex, environment, and system utilities.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "r4_u3",
                "number": "03",
                "name": "Unit 3: Object-Oriented Programming and Package Development in R",
                "description": "S3/S4 classes, R package design, and CRAN publishing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "r4_u4",
                "number": "04",
                "name": "Unit 4: Comparative Analysis and Real-World Applications of R",
                "description": "Comparing R with Python and domain-specific analytical projects.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "data_mining_sem4",
            "name": "Data Mining",
            "description": "Introduction to data mining and statistical-based algorithms.",
            "modulesCount": 2,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Layers",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "dm4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Mining Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "dm4_u1",
                "number": "01",
                "name": "Unit 1: Introduction",
                "description": "Data mining concepts, architecture, and data preprocessing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dm4_u2",
                "number": "02",
                "name": "Unit 2: Statistical-Based Algorithms",
                "description": "Statistical association rules, clustering, and classification.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ai_lab_sem4",
            "name": "Artificial Intelligence Lab",
            "description": "Practical laboratory for Artificial Intelligence.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ai_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "Artificial Intelligence Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ai_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "Artificial Intelligence Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ai_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Artificial Intelligence Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "data_analytics_lab_sem4",
            "name": "Data Analytics Lab",
            "description": "Practical laboratory for Data Analytics.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "da_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Analytics Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "da_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Analytics Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "da_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Analytics Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "r_lab_sem4",
            "name": "R Programming Lab",
            "description": "Practical laboratory for Scientific Programming using R.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "r_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "R Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "r_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "R Programming Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "r_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "R Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "nlp_sec_sem4",
            "name": "Basics of Natural Language Processing (SEC)",
            "description": "Skill enhancement course in Basics of Natural Language Processing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "MessageSquare",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "nlp4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Basics of Natural Language Processing Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "nlp4_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Introduction to NLP, tokenization, and text processing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp4_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Language models, POS tagging, and parsing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp4_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Sentiment analysis and text classification.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp4_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Sequence-to-sequence models and applications.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "language_1_sem4",
            "name": "English (Language I)",
            "description": "Semester 4 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "lang1_s4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "lang1_s4_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s4_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s4_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "lang1_s4_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "language_2_sem4",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "lang2_s4_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "kan_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "kan_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "kan_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s4_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "hin_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "hin_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "hin_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "lang2_s4_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ae_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ae_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ae_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 5,
        "name": "Semester 5",
        "description": "Machine Learning, Digital Image Processing, NLP, and Quantitative Techniques",
        "status": "Locked",
        "modulesCount": 15,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ml_nn",
            "name": "ML and Neural Network",
            "description": "Explore neural networks, single-layer models, multi-layer perceptrons, backpropagation, and classification bounds.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "BrainCircuit",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ml_u1",
                "number": "01",
                "name": "Unit 1: Fundamentals of Machine Learning",
                "description": "Supervised and unsupervised learning, bias-variance tradeoff, classification boundaries.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ml_u2",
                "number": "02",
                "name": "Unit 2: Single Layer Perceptron",
                "description": "Activation functions, weight adjustments, linearly separable outputs, and gate learning.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ml_u3",
                "number": "03",
                "name": "Unit 3: Multi-Layer Neural Networks",
                "description": "Hidden layers architectures, activation functions (ReLU, Sigmoid, Softmax), and weight matrices.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ml_u4",
                "number": "04",
                "name": "Unit 4: Training & Backpropagation",
                "description": "Gradient descent, error backpropagation formulas, learning rates, and optimization.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "dip",
            "name": "Digital Image Processing",
            "description": "Examine matrix representation of images, filters, sharpening, edge segmentation, and compression models.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Eye",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "dip_u1",
                "number": "01",
                "name": "Unit 1: Image Representation",
                "description": "Pixels matrices, sampling, quantization, color models (RGB, YUV, HSV).",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dip_u2",
                "number": "02",
                "name": "Unit 2: Enhancement & Filtering",
                "description": "Histogram equalization, smoothing filters, gaussian blur, and sharpening.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dip_u3",
                "number": "03",
                "name": "Unit 3: Edge Detection",
                "description": "Sobel, Prewitt, Canny operators, and image segmentation techniques.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dip_u4",
                "number": "04",
                "name": "Unit 4: Compression",
                "description": "Lossless vs lossy techniques, JPEG compression models, and discrete cosine transforms.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "nlp",
            "name": "Natural Language Processing",
            "description": "Tokenizers, grammatical tagging, language model architectures, and sentiment analyzers.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Languages",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "nlp_u1",
                "number": "01",
                "name": "Unit 1: Tokenization & Syntax",
                "description": "Text preprocessing, stemmers, lemmatizers, and regular expression models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp_u2",
                "number": "02",
                "name": "Unit 2: POS Tagging",
                "description": "Part-Of-Speech tagging, chunking, and named entity recognition architectures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp_u3",
                "number": "03",
                "name": "Unit 3: Language Models",
                "description": "N-grams, TF-IDF weights, word embeddings (Word2Vec, GloVe), and transformers.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "nlp_u4",
                "number": "04",
                "name": "Unit 4: Sentiment Analysis",
                "description": "Classifier training, transformers pipeline, and document semantic checks.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "quant_tech",
            "name": "Quantitative Techniques",
            "description": "Linear optimization models, transportation models, queuing theory, and minimax game solvers.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "TrendingUp",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "qt_u1",
                "number": "01",
                "name": "Unit 1: Linear Programming",
                "description": "Formulating linear constraints, Simplex method solvers, and dual models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "qt_u2",
                "number": "02",
                "name": "Unit 2: Network Analysis",
                "description": "PERT and CPM charts, project timeline optimizations, and critical paths.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "qt_u3",
                "number": "03",
                "name": "Unit 3: Game Theory",
                "description": "Pure vs mixed strategies, saddle points, and multi-player payoff tables.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "qt_u4",
                "number": "04",
                "name": "Unit 4: Decision Theory",
                "description": "Decision making under risk, expectation matrix evaluation, and utility functions.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "labs_sem5",
            "name": "Practical Labs (Sem 5)",
            "description": "PyTorch modeling and OpenCV scripts for machine learning and digital image segmentation.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "l_ml",
                "number": "01",
                "name": "ML and Neural Network Lab",
                "description": "Train backpropagation nets in PyTorch and plot loss optimization curves.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab",
                "children": [
                  {
                    "id": "lab_ml_manual",
                    "number": "01",
                    "name": "Manual",
                    "description": "ML lab manual.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_ml_outputs",
                    "number": "02",
                    "name": "Outputs",
                    "description": "ML model outputs.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_ml_viva",
                    "number": "03",
                    "name": "Viva Questions",
                    "description": "ML viva questions.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  }
                ]
              },
              {
                "id": "l_dip",
                "number": "02",
                "name": "Digital Image Processing Lab",
                "description": "Apply Sobel edges and custom filters kernels on OpenCV image matrices.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab",
                "children": [
                  {
                    "id": "lab_dip_manual",
                    "number": "01",
                    "name": "Manual",
                    "description": "DIP lab manual.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_dip_outputs",
                    "number": "02",
                    "name": "Outputs",
                    "description": "DIP filter outputs.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_dip_viva",
                    "number": "03",
                    "name": "Viva Questions",
                    "description": "DIP viva questions.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  }
                ]
              },
              {
                "id": "l_nlp",
                "number": "03",
                "name": "Natural Language Processing Lab",
                "description": "Implement tokenization, POS tagging, TF-IDF vectorization, and sentiment classifiers.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab",
                "children": [
                  {
                    "id": "lab_nlp_manual",
                    "number": "01",
                    "name": "Manual",
                    "description": "NLP lab manual.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_nlp_outputs",
                    "number": "02",
                    "name": "Outputs",
                    "description": "NLP classification outputs.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_nlp_viva",
                    "number": "03",
                    "name": "Viva Questions",
                    "description": "NLP viva questions.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "aiml_english_sem5",
            "name": "English (Language I)",
            "description": "Semester 5 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "aiml_eng_s5_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 5 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "aiml_eng_s5_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s5_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s5_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s5_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "aiml_lang2_sem5",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "aiml_lang2_s5_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_kan_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_kan_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_kan_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_kan_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "aiml_lang2_s5_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_hin_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_hin_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_hin_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_hin_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "aiml_lang2_s5_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_ae_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_ae_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_ae_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_ae_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 6,
        "name": "Semester 6",
        "description": "Computer Vision Deep Learning, Predictive Analysis, and Capstone Project Work",
        "status": "Locked",
        "modulesCount": 10,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "deep_cv",
            "name": "Deep Learning for Computer Vision",
            "description": "Convolutional Neural Networks (CNNs), object localized tagging, image masks, and GANs generators.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Eye",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "cv_u1",
                "number": "01",
                "name": "Unit 1: Convolutional Neural Networks",
                "description": "Pooling filters, padding formulas, kernel weight structures, and ResNet models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "cv_u2",
                "number": "02",
                "name": "Unit 2: Object Detection",
                "description": "YOLO classification models, bounding box regression, intersection-over-union metric.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "cv_u3",
                "number": "03",
                "name": "Unit 3: Image Segmentation",
                "description": "Semantic vs instance classification, UNet models, and pixel-level mask tags.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "cv_u4",
                "number": "04",
                "name": "Unit 4: GANs",
                "description": "Generators and Discriminators training pipelines, synthetic images generation.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "predictive_analysis",
            "name": "Predictive Analysis",
            "description": "Forecasting mathematical trends, logistic modeling regressions, and ensemble trees algorithms.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "TrendingUp",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "pa_u1",
                "number": "01",
                "name": "Unit 1: Linear & Logistic Models",
                "description": "Fittings mathematical variables, log-likelihood ratios, and confusion matrix validation.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pa_u2",
                "number": "02",
                "name": "Unit 2: Time Series Forecasting",
                "description": "ARIMA statistical formulas, trend indicators, stationarity checks, and LSTM models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pa_u3",
                "number": "03",
                "name": "Unit 3: Ensemble Learning",
                "description": "Random Forests models, AdaBoost frameworks, and XGBoost gradient boosters.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pa_u4",
                "number": "04",
                "name": "Unit 4: Model Evaluation",
                "description": "K-fold cross-validation, ROC curves analysis, and precision-recall tradeoffs.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "project_work",
            "name": "Project Work",
            "description": "Full-scale software development and deployment. Requires database design, modeling, and system verification.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Workflow",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "pw_u1",
                "number": "01",
                "name": "Unit 1: System Requirement Analysis",
                "description": "Flowcharting specifications, data dictionary models, and architecture design.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pw_u2",
                "number": "02",
                "name": "Unit 2: Interface Design",
                "description": "Responsive component layouts and REST API route blueprints.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pw_u3",
                "number": "03",
                "name": "Unit 3: Core Implementation",
                "description": "Backend models construction, frontend bindings, and database migrations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "pw_u4",
                "number": "04",
                "name": "Unit 4: System Integration & Testing",
                "description": "Deploying nodes, stress tests, security logs verification, and project thesis.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "soft_skills",
            "name": "Soft Skills",
            "description": "Professional workplace communication, team project management, resumes composition, and public speaking.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "BookOpen",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ss_u1",
                "number": "01",
                "name": "Unit 1: Interpersonal Communication",
                "description": "Active listening, collaborative writing, and constructive peer reviews.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ss_u2",
                "number": "02",
                "name": "Unit 2: Resume Building",
                "description": "Drafting punchy technical summaries, formatting achievements, and organizing GitHub repositories.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ss_u3",
                "number": "03",
                "name": "Unit 3: Interview Mastery",
                "description": "Answering algorithmic whiteboard challenges and behavioral scenario questions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ss_u4",
                "number": "04",
                "name": "Unit 4: Public Speaking",
                "description": "Structuring a technical presentation, designing clear slide decks, and managing Q&A.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "labs_sem6",
            "name": "Practical Labs (Sem 6)",
            "description": "Deep Learning models implementation, Computer Vision pipelines, and Predictive Analytics models.",
            "modulesCount": 2,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "l_dl_cv",
                "number": "01",
                "name": "Deep Learning & CV Lab",
                "description": "Build CNN classification models, YOLO object detectors, and image segmentation masks.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab",
                "children": [
                  {
                    "id": "lab_dl_cv_manual",
                    "number": "01",
                    "name": "Manual",
                    "description": "Deep Learning & CV lab manual.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_dl_cv_outputs",
                    "number": "02",
                    "name": "Outputs",
                    "description": "Deep Learning lab outputs.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_dl_cv_viva",
                    "number": "03",
                    "name": "Viva Questions",
                    "description": "Deep Learning viva questions.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  }
                ]
              },
              {
                "id": "l_pred_analytics",
                "number": "02",
                "name": "Predictive Analytics Lab",
                "description": "Implement ARIMA time series models, XGBoost classifiers, and cross-validation pipelines.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab",
                "children": [
                  {
                    "id": "lab_pred_manual",
                    "number": "01",
                    "name": "Manual",
                    "description": "Predictive Analytics lab manual.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_pred_outputs",
                    "number": "02",
                    "name": "Outputs",
                    "description": "Predictive Analytics outputs.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  },
                  {
                    "id": "lab_pred_viva",
                    "number": "03",
                    "name": "Viva Questions",
                    "description": "Predictive Analytics viva questions.",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "lab-section"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "aiml_english_sem6",
            "name": "English (Language I)",
            "description": "Semester 6 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "aiml_eng_s6_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 6 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "aiml_eng_s6_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s6_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s6_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "aiml_eng_s6_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "aiml_lang2_sem6",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "aiml_lang2_s6_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_kan_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_kan_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_kan_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_kan_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "aiml_lang2_s6_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_hin_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_hin_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_hin_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_hin_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "aiml_lang2_s6_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "aiml_ae_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "aiml_ae_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_ae_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "aiml_ae_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      }
    ]
  },
  {
    "id": "general",
    "name": "BCA GENERAL",
    "description": "Bachelor of Computer Applications - Standard Curriculum with deep algorithmic focus",
    "semesters": [
      {
        "id": 1,
        "name": "Semester 1",
        "description": "Discrete Structure, Problem Solving Technique, Computer Architecture, Labs, Languages, and Constitution of India",
        "status": "In Progress",
        "modulesCount": 20,
        "completedModules": 14,
        "progressPercent": 70,
        "borderClass": "border-[#fd9b65]",
        "badgeBg": "bg-[#fff2e1] text-[#95491a]",
        "badgeText": "Current",
        "icon": "BookOpen",
        "subjects": [
          {
            "id": "gen_discrete_structure",
            "name": "Discrete Structure",
            "description": "Set theory, logic, counting, matrices, and graph theory.",
            "modulesCount": 4,
            "completedModules": 4,
            "difficulty": "Core",
            "icon": "Binary",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 100,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_ds_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Discrete Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_ds_u1",
                "number": "01",
                "name": "Unit 1: Set Theory",
                "description": "Set theory principles and relations.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Sets and Subsets",
                  "Venn Diagrams",
                  "Set Operations",
                  "Cartesian Products",
                  "Relations and Functions"
                ]
              },
              {
                "id": "gen_ds_u2",
                "number": "02",
                "name": "Unit 2: Logic and Counting",
                "description": "Propositional logic and counting techniques.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Propositional Logic",
                  "Truth Tables",
                  "Tautologies",
                  "Permutations",
                  "Combinations",
                  "Pigeonhole Principle"
                ]
              },
              {
                "id": "gen_ds_u3",
                "number": "03",
                "name": "Unit 3: Matrices",
                "description": "Matrix algebra and determinants.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Matrix Operations",
                  "Determinants",
                  "System of Linear Equations",
                  "Eigenvalues",
                  "Eigenvectors",
                  "Cayley-Hamilton Theorem"
                ]
              },
              {
                "id": "gen_ds_u4",
                "number": "04",
                "name": "Unit 4: Graph Theory",
                "description": "Graphs, trees, and paths.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Basic Graph Terminology",
                  "Euler Paths",
                  "Hamiltonian Cycles",
                  "Trees",
                  "Graph Coloring",
                  "Planar Graphs"
                ]
              }
            ],
            "materials": [
              {
                "id": "mat_gen_ds_1",
                "name": "Set Theory & Relations Solved Proofs.pdf",
                "size": "2.1 MB",
                "addedTime": "Added 3 days ago",
                "type": "pdf",
                "isBookmarked": false,
                "tag": "Handwritten",
                "details": "Step-by-step mathematical proofs of power sets, bijection mapping, and equivalence relations."
              },
              {
                "id": "mat_gen_ds_2",
                "name": "Truth Tables & Combinatorics Practice.pdf",
                "size": "1.4 MB",
                "addedTime": "Alumni Resource",
                "type": "pdf",
                "isBookmarked": false,
                "tag": "Must Read",
                "details": "Midterm prep booklet with 45 solved examples of permutations, logic formulas, and quantifiers."
              }
            ]
          },
          {
            "id": "gen_problem_solving",
            "name": "Problem Solving Technique",
            "description": "Algorithms, C programming, factoring methods, searching and sorting.",
            "modulesCount": 4,
            "completedModules": 3,
            "difficulty": "Intermediate",
            "icon": "Braces",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 75,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_ps_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Problem Solving Technique Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_ps_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Fundamental Algorithms",
                "description": "Fundamental algorithm design.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "gen_ps_u2",
                "number": "02",
                "name": "Unit 2: C Programming",
                "description": "C language fundamentals.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "gen_ps_u3",
                "number": "03",
                "name": "Unit 3: Factoring Methods & Array Techniques",
                "description": "Factoring techniques and array manipulation.",
                "masteryPercent": 80,
                "status": "In Progress"
              },
              {
                "id": "gen_ps_u4",
                "number": "04",
                "name": "Unit 4: Sorting, Searching & Pattern Searching",
                "description": "Searching and sorting algorithms.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": [
              {
                "id": "mat_gen_ps_1",
                "name": "Interactive Pointer Demos.java",
                "size": "Code File",
                "addedTime": "Lab Practical",
                "type": "code",
                "isBookmarked": false,
                "details": "// C Pointer demonstration\n#include <stdio.h>\nint main() {\n    int value = 42;\n    int *ptr = &value;\n    printf(\"Value: %d\\n\", value);\n    printf(\"Pointer Address: %p\\n\", ptr);\n    printf(\"Deref Pointer: %d\\n\", *ptr);\n    return 0;\n}"
              }
            ]
          },
          {
            "id": "gen_computer_arch",
            "name": "Computer Architecture",
            "description": "Number systems, combinational circuits, computer organization, and 8085 assembly.",
            "modulesCount": 4,
            "completedModules": 2,
            "difficulty": "Core",
            "icon": "Cpu",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 50,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_ca_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Computer Architecture Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_ca_u1",
                "number": "01",
                "name": "Unit 1: Number Systems & Digital Logic Circuits",
                "description": "Digital logic and number conversions.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "gen_ca_u2",
                "number": "02",
                "name": "Unit 2: Combinational Circuits & Digital Components",
                "description": "Logic circuits and components.",
                "masteryPercent": 85,
                "status": "In Progress"
              },
              {
                "id": "gen_ca_u3",
                "number": "03",
                "name": "Unit 3: Basic Computer Organization & CPU",
                "description": "Basic CPU architecture and instructions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_ca_u4",
                "number": "04",
                "name": "Unit 4: 8085 Microprocessor & Assembly Language Programming",
                "description": "8085 microprocessor assembly programming.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": [
              {
                "id": "mat_gen_ca_1",
                "name": "K-Map Simplification Guide.pdf",
                "size": "1.8 MB",
                "addedTime": "Added 1 week ago",
                "type": "pdf",
                "isBookmarked": false,
                "details": "Comprehensive guide to 3, 4, and 5 variable K-Maps with grouping and don't care conditions."
              }
            ]
          },
          {
            "id": "gen_ps_lab_sem1",
            "name": "Problem Solving Technique Lab",
            "description": "Practical laboratory for Problem Solving Technique.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_ps_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Problem Solving Technique Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ps_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Problem Solving Technique Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ps_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Problem Solving Technique Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_ca_lab_sem1",
            "name": "Computer Architecture Lab",
            "description": "Practical laboratory for Computer Architecture.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_ca_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Computer Architecture Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ca_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Computer Architecture Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ca_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Computer Architecture Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_oat_lab_sem1",
            "name": "Office Automation Tools Lab",
            "description": "Practical laboratory for Office Automation Tools.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_oat_lab1_m",
                "number": "01",
                "name": "Manual",
                "description": "Office Automation Tools Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_oat_lab1_o",
                "number": "02",
                "name": "Outputs",
                "description": "Office Automation Tools Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_oat_lab1_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Office Automation Tools Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_language_1_sem1",
            "name": "English (Language I)",
            "description": "Semester 1 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "gen_lang1_s1_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_lang1_s1_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s1_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s1_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s1_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_language_2_sem1",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "gen_lang2_s1_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_kan_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_kan_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_kan_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_kan_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "gen_lang2_s1_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_hin_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_hin_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_hin_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_hin_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "gen_lang2_s1_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_ae_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_ae_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_ae_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_ae_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "gen_constitution_of_india",
            "name": "Constitution of India",
            "description": "Preamble, Fundamental Rights, Directive Principles, and Union Executive.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "ShieldAlert",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_coi_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Constitution of India Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_coi_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Framing of Indian Constitution and Preamble.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_coi_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Fundamental Rights and Fundamental Duties.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_coi_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Directive Principles of State Policy.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_coi_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Union Executive and Parliamentary Principles.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 2,
        "name": "Semester 2",
        "description": "Data Structure, OOP using Java, Operating Systems, Labs, Languages, and Environmental Studies",
        "status": "Locked",
        "modulesCount": 20,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "gen_data_structure",
            "name": "Data Structure",
            "description": "Overview, arrays & linked lists, stacks & queues, trees, graphs & hashing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Network",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_ds2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_ds2_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Overview",
                "description": "Data structures classification and algorithms analysis.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_ds2_u2",
                "number": "02",
                "name": "Unit 2: Arrays & Linked Lists",
                "description": "Arrays and linked list representations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_ds2_u3",
                "number": "03",
                "name": "Unit 3: Stacks & Queues",
                "description": "Stack operations and queue implementations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_ds2_u4",
                "number": "04",
                "name": "Unit 4: Trees, Graphs & Hashing",
                "description": "Trees, graph algorithms, and hash tables.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_java_programming",
            "name": "Object Oriented Programming using Java",
            "description": "Java introduction, inheritance & polymorphism, event handling & GUI, exception handling & multithreading.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Coffee",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_java_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Object Oriented Programming using Java Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_java_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Java",
                "description": "Java language basics and JVM.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_java_u2",
                "number": "02",
                "name": "Unit 2: Inheritance, Polymorphism, Packages & I/O",
                "description": "Object-oriented principles in Java.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_java_u3",
                "number": "03",
                "name": "Unit 3: Event Handling, GUI, Applets & String Handling",
                "description": "Event-driven programming and GUI design.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_java_u4",
                "number": "04",
                "name": "Unit 4: Exception Handling, Multithreading & Collections",
                "description": "Robust exception handling and multithreading.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_operating_systems",
            "name": "Operating Systems",
            "description": "OS & processes, synchronization & deadlocks, memory management & files, Linux programming.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Settings",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_os2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Operating Systems Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_os2_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Operating Systems & Processes",
                "description": "Process concepts and kernel architectures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_os2_u2",
                "number": "02",
                "name": "Unit 2: Process Synchronization, Scheduling & Deadlocks",
                "description": "CPU scheduling and process locks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_os2_u3",
                "number": "03",
                "name": "Unit 3: Memory Management & File Systems",
                "description": "Virtual memory and file organization.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_os2_u4",
                "number": "04",
                "name": "Unit 4: Linux Programming & Commands",
                "description": "Shell scripting and Linux system tools.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_ds_lab_sem2",
            "name": "Data Structure Lab",
            "description": "Practical laboratory for Data Structure.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_ds_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Structure Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ds_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Structure Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_ds_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Structure Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_os_lab_sem2",
            "name": "Operating Systems Lab",
            "description": "Practical laboratory for Operating Systems.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_os_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Operating Systems Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_os_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Operating Systems Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_os_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Operating Systems Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_linux_lab_sem2",
            "name": "Linux & Shell Programming Lab",
            "description": "Practical laboratory for Linux & Shell Programming.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-cyan-50 text-cyan-800",
            "textColor": "text-cyan-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "gen_lin_lab2_m",
                "number": "01",
                "name": "Manual",
                "description": "Linux & Shell Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_lin_lab2_o",
                "number": "02",
                "name": "Outputs",
                "description": "Linux & Shell Programming Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "gen_lin_lab2_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Linux & Shell Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_language_1_sem2",
            "name": "English (Language I)",
            "description": "Semester 2 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "gen_lang1_s2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_lang1_s2_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s2_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s2_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "gen_lang1_s2_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_language_2_sem2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "gen_lang2_s2_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_kan_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_kan_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_kan_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_kan_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "gen_lang2_s2_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_hin_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_hin_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_hin_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_hin_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "gen_lang2_s2_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "gen_ae_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "gen_ae_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_ae_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "gen_ae_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "gen_environmental_studies",
            "name": "Environmental Studies",
            "description": "Ecosystems, biodiversity, pollution, and sustainable development.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Leaf",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "gen_env_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Environmental Studies Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "gen_env_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Ecosystems and natural resources.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_env_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Biodiversity and conservation.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_env_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Environmental pollution and global climate change.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gen_env_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Sustainable development and environmental ethics.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 3,
        "name": "Semester 3",
        "description": "DBMS, Software Engineering, and Computer Networks",
        "status": "Locked",
        "modulesCount": 12,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "gen_dbms",
            "name": "Database Management System",
            "description": "ER model mappings, relational algebraic equations, and 3NF normalizations.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Database",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "gdbms_u1",
                "number": "01",
                "name": "Unit 1: DB Foundations",
                "description": "ER mappings, schemas, entities, and relational tables keys.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gdbms_u2",
                "number": "02",
                "name": "Unit 2: Normalization",
                "description": "Decomposing schemas into 1NF, 2NF, 3NF and BCNF.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gdbms_u3",
                "number": "03",
                "name": "Unit 3: Structured Query",
                "description": "Select queries, nested queries, outer joins, and tables view.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gdbms_u4",
                "number": "04",
                "name": "Unit 4: ACID Transactions",
                "description": "Serializability levels, locking guidelines, and rollback procedures.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "general_english_sem3",
            "name": "English (Language I)",
            "description": "Semester 3 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "general_eng_s3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 3 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "general_eng_s3_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s3_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s3_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s3_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "general_lang2_sem3",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "general_lang2_s3_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_kan_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_kan_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s3_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_hin_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_hin_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s3_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_ae_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_ae_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 4,
        "name": "Semester 4",
        "description": "Web Programming, Computer Graphics, and Software Testing",
        "status": "Locked",
        "modulesCount": 12,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "gen_web",
            "name": "Web Programming",
            "description": "Develop interactive frontends using HTML5, CSS3, and modern Javascript.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Layers",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "gweb_u1",
                "number": "01",
                "name": "Unit 1: HTML & CSS Markup",
                "description": "Semantic boxes layout, grid grids, and flexible alignments.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gweb_u2",
                "number": "02",
                "name": "Unit 2: JS Scripting",
                "description": "Asynchronous scripts, event loops, DOM, and local storage variables.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gweb_u3",
                "number": "03",
                "name": "Unit 3: Responsive layouts",
                "description": "Media queries rules, mobile views, and viewport adjustments.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gweb_u4",
                "number": "04",
                "name": "Unit 4: Framework overview",
                "description": "Client-side routing architectures, components state, and virtual nodes.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "general_english_sem4",
            "name": "English (Language I)",
            "description": "Semester 4 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "general_eng_s4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 4 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "general_eng_s4_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s4_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s4_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s4_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "general_lang2_sem4",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "general_lang2_s4_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_kan_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_kan_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s4_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_hin_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_hin_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s4_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_ae_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_ae_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 5,
        "name": "Semester 5",
        "description": "Cryptography, Cloud Computing, and Mobile Applications",
        "status": "Locked",
        "modulesCount": 12,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "gen_crypt",
            "name": "Cryptography & Security",
            "description": "Mathematical encryptions, private keys signatures, and network security protocols.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "ShieldAlert",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "gcr_u1",
                "number": "01",
                "name": "Unit 1: Encryption Ciphers",
                "description": "Caesar shift, Vigenere, transposition matrices, and DES standard.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcr_u2",
                "number": "02",
                "name": "Unit 2: Public Keys",
                "description": "RSA modular arithmetic equations, Diffie-Hellman keys exchange.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcr_u3",
                "number": "03",
                "name": "Unit 3: Hash Signatures",
                "description": "SHA-256 blocks, collision limits, and public keys certificates.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcr_u4",
                "number": "04",
                "name": "Unit 4: Firewall Proxies",
                "description": "SSL handshakes protocols, firewalls setup, and intrusion sensors.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "general_english_sem5",
            "name": "English (Language I)",
            "description": "Semester 5 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "general_eng_s5_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 5 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "general_eng_s5_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s5_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s5_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s5_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "general_lang2_sem5",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "general_lang2_s5_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_kan_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_kan_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s5_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_hin_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_hin_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s5_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_ae_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_ae_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 6,
        "name": "Semester 6",
        "description": "Capstone Project and Cyber Security",
        "status": "Locked",
        "modulesCount": 8,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "gen_cyber",
            "name": "Cyber Security Fundamentals",
            "description": "Information assurance controls, software vulnerabilities patching, and ethical testing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "ShieldAlert",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "gcy_u1",
                "number": "01",
                "name": "Unit 1: Threat Models",
                "description": "Malware signatures, phish tricks, and buffer overflows vulnerabilities.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcy_u2",
                "number": "02",
                "name": "Unit 2: Security Patch",
                "description": "Secure programming bounds, SQL injection filters, inputs escape.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcy_u3",
                "number": "03",
                "name": "Unit 3: Audit Compliance",
                "description": "ISO 27001 rules, privacy acts, and security log audit trails.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gcy_u4",
                "number": "04",
                "name": "Unit 4: Forensic Checks",
                "description": "Hard disk dumps inspection, registry logs, and network capture checks.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "gen_project",
            "name": "Capstone Project Work",
            "description": "Formulate requirements specifications, construct software modules, and write thesis files.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Workflow",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "units": [
              {
                "id": "gpw_u1",
                "number": "01",
                "name": "Unit 1: SRS specifications",
                "description": "Architectures diagrams, entities definitions, system specifications.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gpw_u2",
                "number": "02",
                "name": "Unit 2: Implementation",
                "description": "Establish server databases, design frontend screens, compile controllers.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gpw_u3",
                "number": "03",
                "name": "Unit 3: Diagnostics Tests",
                "description": "Write test suites, run edge cases validation, record benchmarks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "gpw_u4",
                "number": "04",
                "name": "Unit 4: Project Thesis",
                "description": "Final software packaging, documentation files, and slides preparation.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "general_english_sem6",
            "name": "English (Language I)",
            "description": "Semester 6 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "general_eng_s6_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 6 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "general_eng_s6_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s6_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s6_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "general_eng_s6_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "general_lang2_sem6",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "general_lang2_s6_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_kan_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_kan_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_kan_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s6_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_hin_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_hin_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_hin_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "general_lang2_s6_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "general_ae_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "general_ae_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "general_ae_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      }
    ]
  },
  {
    "id": "ds",
    "name": "BCA DS",
    "description": "Bachelor of Computer Applications in Data Science - Statistics and Analytics specialization",
    "semesters": [
      {
        "id": 1,
        "name": "Semester 1",
        "description": "Discrete Structure, Problem Solving Technique, Computer Architecture, Labs, Languages, and Constitution of India",
        "status": "In Progress",
        "modulesCount": 20,
        "completedModules": 14,
        "progressPercent": 70,
        "borderClass": "border-[#fd9b65]",
        "badgeBg": "bg-[#fff2e1] text-[#95491a]",
        "badgeText": "Current",
        "icon": "BookOpen",
        "subjects": [
          {
            "id": "ds_s1_discrete_structure",
            "name": "Discrete Structure",
            "description": "Set theory, logic, counting, matrices, and graph theory.",
            "modulesCount": 4,
            "completedModules": 4,
            "difficulty": "Core",
            "icon": "Binary",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 100,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s1_ds_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Discrete Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s1_ds_u1",
                "number": "01",
                "name": "Unit 1: Set Theory",
                "description": "Set theory principles and relations.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Sets and Subsets",
                  "Venn Diagrams",
                  "Set Operations",
                  "Cartesian Products",
                  "Relations and Functions"
                ]
              },
              {
                "id": "ds_s1_ds_u2",
                "number": "02",
                "name": "Unit 2: Logic and Counting",
                "description": "Propositional logic and counting techniques.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Propositional Logic",
                  "Truth Tables",
                  "Tautologies",
                  "Permutations",
                  "Combinations",
                  "Pigeonhole Principle"
                ]
              },
              {
                "id": "ds_s1_ds_u3",
                "number": "03",
                "name": "Unit 3: Matrices",
                "description": "Matrix algebra and determinants.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Matrix Operations",
                  "Determinants",
                  "System of Linear Equations",
                  "Eigenvalues",
                  "Eigenvectors",
                  "Cayley-Hamilton Theorem"
                ]
              },
              {
                "id": "ds_s1_ds_u4",
                "number": "04",
                "name": "Unit 4: Graph Theory",
                "description": "Graphs, trees, and paths.",
                "masteryPercent": 100,
                "status": "Mastered",
                "topics": [
                  "Basic Graph Terminology",
                  "Euler Paths",
                  "Hamiltonian Cycles",
                  "Trees",
                  "Graph Coloring",
                  "Planar Graphs"
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_problem_solving",
            "name": "Problem Solving Technique",
            "description": "Algorithms, C programming, factoring methods, searching and sorting.",
            "modulesCount": 4,
            "completedModules": 3,
            "difficulty": "Intermediate",
            "icon": "Braces",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 75,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s1_ps_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Problem Solving Technique Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s1_ps_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Fundamental Algorithms",
                "description": "Fundamental algorithm design.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ds_s1_ps_u2",
                "number": "02",
                "name": "Unit 2: C Programming",
                "description": "C language fundamentals.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ds_s1_ps_u3",
                "number": "03",
                "name": "Unit 3: Factoring Methods & Array Techniques",
                "description": "Factoring techniques and array manipulation.",
                "masteryPercent": 80,
                "status": "In Progress"
              },
              {
                "id": "ds_s1_ps_u4",
                "number": "04",
                "name": "Unit 4: Sorting, Searching & Pattern Searching",
                "description": "Searching and sorting algorithms.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_computer_arch",
            "name": "Computer Architecture",
            "description": "Number systems, combinational circuits, computer organization, and 8085 assembly.",
            "modulesCount": 4,
            "completedModules": 2,
            "difficulty": "Core",
            "icon": "Cpu",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 50,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s1_ca_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Computer Architecture Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s1_ca_u1",
                "number": "01",
                "name": "Unit 1: Number Systems & Digital Logic Circuits",
                "description": "Digital logic and number conversions.",
                "masteryPercent": 100,
                "status": "Mastered"
              },
              {
                "id": "ds_s1_ca_u2",
                "number": "02",
                "name": "Unit 2: Combinational Circuits & Digital Components",
                "description": "Logic circuits and components.",
                "masteryPercent": 85,
                "status": "In Progress"
              },
              {
                "id": "ds_s1_ca_u3",
                "number": "03",
                "name": "Unit 3: Basic Computer Organization & CPU",
                "description": "Basic CPU architecture and instructions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s1_ca_u4",
                "number": "04",
                "name": "Unit 4: 8085 Microprocessor & Assembly Language Programming",
                "description": "8085 microprocessor assembly programming.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_ps_lab",
            "name": "Problem Solving Technique Lab",
            "description": "Practical laboratory for Problem Solving Technique.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s1_ps_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Problem Solving Technique Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_ps_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Problem Solving Technique Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_ps_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Problem Solving Technique Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_ca_lab",
            "name": "Computer Architecture Lab",
            "description": "Practical laboratory for Computer Architecture.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s1_ca_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Computer Architecture Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_ca_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Computer Architecture Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_ca_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Computer Architecture Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_oat_lab",
            "name": "Office Automation Tools Lab",
            "description": "Practical laboratory for Office Automation Tools.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s1_oat_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Office Automation Tools Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_oat_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Office Automation Tools Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s1_oat_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Office Automation Tools Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_language_1",
            "name": "English (Language I)",
            "description": "Semester 1 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang1_s1_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_lang1_s1_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s1_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s1_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s1_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_language_2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s1_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s1_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s1_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s1_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s1_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s1_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s1_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s1_constitution",
            "name": "Constitution of India",
            "description": "Indian Constitution principles, fundamental rights, directive principles, and union executive.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "ShieldAlert",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_coi_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Constitution of India Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_coi_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Preamble, fundamental rights, and duties.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_coi_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Directive principles of state policy.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_coi_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Union executive, parliament, and judiciary.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_coi_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "State executive, legislature, and emergency provisions.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 2,
        "name": "Semester 2",
        "description": "Data Structure, Object Oriented Programming using Java, Operating Systems, Labs, Languages, Environmental Studies",
        "status": "Locked",
        "modulesCount": 20,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ds_s2_data_structure",
            "name": "Data Structure",
            "description": "Introduction & overview, arrays & linked lists, stacks & queues, trees, graphs & hashing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Network",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s2_ds_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Structure Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s2_ds_u1",
                "number": "01",
                "name": "Unit 1: Introduction & Overview",
                "description": "Data structures fundamentals and complexity.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_ds_u2",
                "number": "02",
                "name": "Unit 2: Arrays & Linked Lists",
                "description": "Arrays and singly/doubly linked list operations.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_ds_u3",
                "number": "03",
                "name": "Unit 3: Stacks & Queues",
                "description": "Stack and queue data structures and applications.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_ds_u4",
                "number": "04",
                "name": "Unit 4: Trees, Graphs & Hashing",
                "description": "Trees, graph algorithms, and hash tables.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_oop_java",
            "name": "Object Oriented Programming using Java",
            "description": "Introduction to Java, inheritance & polymorphism, event handling & GUI, exception handling & multithreading.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Coffee",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s2_java_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Object Oriented Programming using Java Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s2_java_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Java",
                "description": "Java fundamentals, classes, and objects.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_java_u2",
                "number": "02",
                "name": "Unit 2: Inheritance, Polymorphism, Packages & I/O",
                "description": "Inheritance hierarchies and package management.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_java_u3",
                "number": "03",
                "name": "Unit 3: Event Handling, GUI, Applets & String Handling",
                "description": "Swing GUI components and string processing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_java_u4",
                "number": "04",
                "name": "Unit 4: Exception Handling, Multithreading & Collections",
                "description": "Exceptions, concurrent threads, and collections framework.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_operating_systems",
            "name": "Operating Systems",
            "description": "Introduction & processes, synchronization & deadlocks, memory & file systems, Linux programming & commands.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Terminal",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_s2_os_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Operating Systems Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_s2_os_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Operating Systems & Processes",
                "description": "OS architecture and process management.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_os_u2",
                "number": "02",
                "name": "Unit 2: Process Synchronization, Scheduling & Deadlocks",
                "description": "CPU scheduling algorithms and deadlocks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_os_u3",
                "number": "03",
                "name": "Unit 3: Memory Management & File Systems",
                "description": "Virtual memory, paging, and file management.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_s2_os_u4",
                "number": "04",
                "name": "Unit 4: Linux Programming & Commands",
                "description": "Linux shell commands and system calls.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_ds_lab",
            "name": "Data Structure Lab",
            "description": "Practical laboratory for Data Structure.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s2_ds_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Structure Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_ds_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Structure Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_ds_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Structure Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_os_lab",
            "name": "Operating Systems Lab",
            "description": "Practical laboratory for Operating Systems.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s2_os_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Operating Systems Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_os_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Operating Systems Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_os_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Operating Systems Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_linux_lab",
            "name": "Linux & Shell Programming Lab",
            "description": "Practical laboratory for Linux & Shell Programming.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_s2_linux_lab_m",
                "number": "01",
                "name": "Manual",
                "description": "Linux & Shell Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_linux_lab_o",
                "number": "02",
                "name": "Outputs",
                "description": "Linux & Shell Programming Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_s2_linux_lab_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Linux & Shell Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_language_1",
            "name": "English (Language I)",
            "description": "Semester 2 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang1_s2_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_lang1_s2_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s2_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s2_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s2_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_language_2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s2_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s2_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s2_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 2.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s2_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s2_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s2_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s2_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s2_environmental_studies",
            "name": "Environmental Studies",
            "description": "Ecosystems, biodiversity, pollution, and sustainable development.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Leaf",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_env_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Environmental Studies Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_env_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Ecosystems and natural resources.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_env_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Biodiversity and conservation.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_env_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Environmental pollution and global climate change.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_env_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Sustainable development and environmental ethics.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 3,
        "name": "Semester 3",
        "description": "Database Management System, Foundations of Data Science, Python Programming, Data Visualization, Labs, Languages",
        "status": "Locked",
        "modulesCount": 15,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ds_s3_dbms",
            "name": "Database Management System",
            "description": "Fundamentals of database systems, design & storage, relational model & SQL, transactions & PL/SQL.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Database",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_db3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Database Management System Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_db3_u1",
                "number": "01",
                "name": "Unit 1: Fundamentals of Database Systems and Architecture",
                "description": "DBMS architecture and schemas.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_db3_u2",
                "number": "02",
                "name": "Unit 2: Database Design and Storage Structures",
                "description": "ER models, keys, and index structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_db3_u3",
                "number": "03",
                "name": "Unit 3: Relational Model, Normalization and SQL",
                "description": "Normalization rules and SQL queries.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_db3_u4",
                "number": "04",
                "name": "Unit 4: Query Processing, Transactions and PL/SQL",
                "description": "Transactions, locking, and PL/SQL.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_fds",
            "name": "Foundations of Data Science",
            "description": "Foundations, data acquisition & preprocessing, exploratory data analysis & statistical techniques, regression & predictive modeling.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Brain",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_fds3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Foundations of Data Science Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_fds3_u1",
                "number": "01",
                "name": "Unit 1: Foundations of Data Science and Its Applications",
                "description": "Data science ecosystem, principles, and applications.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_fds3_u2",
                "number": "02",
                "name": "Unit 2: Data Acquisition and Preprocessing Techniques",
                "description": "Data gathering, cleaning, and transformation pipelines.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_fds3_u3",
                "number": "03",
                "name": "Unit 3: Exploratory Data Analysis and Statistical Techniques",
                "description": "EDA methods, summary statistics, and hypothesis testing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_fds3_u4",
                "number": "04",
                "name": "Unit 4: Regression Analysis and Predictive Modeling",
                "description": "Linear/logistic regression and model evaluations.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_python",
            "name": "Python Programming",
            "description": "Foundations, data structures & files, OOP & data libraries, data analysis & visualization.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Terminal",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_py3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Python Programming Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_py3_u1",
                "number": "01",
                "name": "Unit 1: Foundations of Python Programming",
                "description": "Python syntax and control structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_py3_u2",
                "number": "02",
                "name": "Unit 2: Data Structures and File Handling",
                "description": "Lists, tuples, dictionaries, and file IO.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_py3_u3",
                "number": "03",
                "name": "Unit 3: Object-Oriented Programming and Data Handling Libraries",
                "description": "Classes, NumPy arrays, and Pandas DataFrames.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_py3_u4",
                "number": "04",
                "name": "Unit 4: Data Analysis and Visualization",
                "description": "Matplotlib and Seaborn plotting.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_data_viz",
            "name": "Data Visualization",
            "description": "Introduction to data visualization & tools, data storytelling & visualization design.",
            "modulesCount": 2,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "BarChart",
            "bgColor": "bg-teal-50 text-teal-800",
            "textColor": "text-teal-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_dv3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Visualization Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_dv3_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Data Visualization and Tools",
                "description": "Visual design principles and tools.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_dv3_u2",
                "number": "02",
                "name": "Unit 2: Data Storytelling and Visualization Design",
                "description": "Designing effective visual narratives.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_dbms_lab",
            "name": "DBMS Lab",
            "description": "Practical laboratory for Database Management System.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-indigo-50 text-indigo-800",
            "textColor": "text-indigo-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_db_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "DBMS Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_db_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "DBMS Lab Query Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_db_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "DBMS Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_ds_lab",
            "name": "Data Science Lab",
            "description": "Practical laboratory for Foundations of Data Science.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-amber-50 text-amber-800",
            "textColor": "text-amber-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_ds_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Science Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_ds_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Science Lab Program Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_ds_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Science Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_python_lab",
            "name": "Python Programming Lab",
            "description": "Practical laboratory for Python Programming.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_py_lab3_m",
                "number": "01",
                "name": "Manual",
                "description": "Python Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_py_lab3_o",
                "number": "02",
                "name": "Outputs",
                "description": "Python Programming Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_py_lab3_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Python Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_language_1",
            "name": "English (Language I)",
            "description": "Semester 3 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang1_s3_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_lang1_s3_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s3_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s3_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s3_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s3_language_2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s3_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s3_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s3_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 3.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s3_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s3_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s3_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s3_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 4,
        "name": "Semester 4",
        "description": "Artificial Intelligence, Data Analytics, Scientific Programming using R, Data Mining, Labs, Basics of NLP, Languages",
        "status": "Locked",
        "modulesCount": 18,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ds_s4_ai",
            "name": "Artificial Intelligence",
            "description": "AI fundamentals & search, knowledge representation & reasoning, planning & perception, ML, neural nets & AI ethics.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "BrainCircuit",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_ai4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Artificial Intelligence Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_ai4_u1",
                "number": "01",
                "name": "Unit 1: Fundamentals of Artificial Intelligence and Search Techniques",
                "description": "Search algorithms and heuristics.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_ai4_u2",
                "number": "02",
                "name": "Unit 2: Knowledge Representation, Reasoning and Learning Paradigms",
                "description": "Knowledge models and inference.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_ai4_u3",
                "number": "03",
                "name": "Unit 3: Planning, Reasoning and Perception",
                "description": "Classical planning and computer vision.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_ai4_u4",
                "number": "04",
                "name": "Unit 4: Machine Learning, Neural Networks and AI Ethics",
                "description": "Supervised ML, neural nets, and ethics.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_data_analytics",
            "name": "Data Analytics",
            "description": "Introduction to data analytics, correlation & regression, probability & statistical methods, Power BI.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "PieChart",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_da4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Analytics Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_da4_u1",
                "number": "01",
                "name": "Unit 1: Introduction to Data Analytics",
                "description": "Data analytics lifecycle and concepts.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_da4_u2",
                "number": "02",
                "name": "Unit 2: Correlation & Regression",
                "description": "Correlation analysis and regression models.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_da4_u3",
                "number": "03",
                "name": "Unit 3: Probability & Statistical Methods",
                "description": "Statistical testing and hypothesis checks.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_da4_u4",
                "number": "04",
                "name": "Unit 4: Power BI",
                "description": "Dashboard design and DAX calculations in Power BI.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_r_prog",
            "name": "Scientific Programming using R",
            "description": "Introduction to R, utilities & system-level programming, OOP & packages, comparative analysis & applications.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Code",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_r4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Scientific Programming using R Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_r4_u1",
                "number": "01",
                "name": "Unit 1: Introduction to R and Fundamental Programming Constructs",
                "description": "R syntax, vectors, matrices, data frames, and control structures.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_r4_u2",
                "number": "02",
                "name": "Unit 2: Utilities and System-Level Programming in R",
                "description": "String manipulation, regex, environment, and system utilities.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_r4_u3",
                "number": "03",
                "name": "Unit 3: Object-Oriented Programming and Package Development in R",
                "description": "S3/S4 classes, R package design, and CRAN publishing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_r4_u4",
                "number": "04",
                "name": "Unit 4: Comparative Analysis and Real-World Applications of R",
                "description": "Comparing R with Python and domain-specific analytical projects.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_data_mining",
            "name": "Data Mining",
            "description": "Introduction to data mining and statistical-based algorithms.",
            "modulesCount": 2,
            "completedModules": 0,
            "difficulty": "Intermediate",
            "icon": "Layers",
            "bgColor": "bg-emerald-50 text-emerald-800",
            "textColor": "text-emerald-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_dm4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Data Mining Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_dm4_u1",
                "number": "01",
                "name": "Unit 1: Introduction",
                "description": "Data mining concepts, architecture, and data preprocessing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_dm4_u2",
                "number": "02",
                "name": "Unit 2: Statistical-Based Algorithms",
                "description": "Statistical association rules, clustering, and classification.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_ai_lab",
            "name": "Artificial Intelligence Lab",
            "description": "Practical laboratory for Artificial Intelligence.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_ai_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "Artificial Intelligence Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_ai_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "Artificial Intelligence Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_ai_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Artificial Intelligence Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_data_analytics_lab",
            "name": "Data Analytics Lab",
            "description": "Practical laboratory for Data Analytics.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-orange-50 text-orange-800",
            "textColor": "text-orange-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_da_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "Data Analytics Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_da_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "Data Analytics Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_da_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "Data Analytics Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_r_lab",
            "name": "R Programming Lab",
            "description": "Practical laboratory for Scientific Programming using R.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Terminal",
            "bgColor": "bg-blue-50 text-blue-800",
            "textColor": "text-blue-800",
            "progressPercent": 0,
            "isLab": true,
            "contentMode": "labs",
            "textbooks": [],
            "units": [
              {
                "id": "ds_r_lab4_m",
                "number": "01",
                "name": "Manual",
                "description": "R Programming Lab Manual",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_r_lab4_o",
                "number": "02",
                "name": "Outputs",
                "description": "R Programming Lab Outputs",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              },
              {
                "id": "ds_r_lab4_v",
                "number": "03",
                "name": "Viva Questions",
                "description": "R Programming Lab Viva Questions",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "lab-section"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_nlp_sec",
            "name": "Basics of Natural Language Processing (SEC)",
            "description": "Skill enhancement course in Basics of Natural Language Processing.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "MessageSquare",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "textbooks": [],
            "contentMode": "units",
            "units": [
              {
                "id": "ds_nlp4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Basics of Natural Language Processing Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_nlp4_u1",
                "number": "01",
                "name": "Unit 1",
                "description": "Introduction to NLP, tokenization, and text processing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_nlp4_u2",
                "number": "02",
                "name": "Unit 2",
                "description": "Language models, POS tagging, and parsing.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_nlp4_u3",
                "number": "03",
                "name": "Unit 3",
                "description": "Sentiment analysis and text classification.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "ds_nlp4_u4",
                "number": "04",
                "name": "Unit 4",
                "description": "Sequence-to-sequence models and applications.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_language_1",
            "name": "English (Language I)",
            "description": "Semester 4 Language I coursework and chapters.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang1_s4_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Language I Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_lang1_s4_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Language I Chapter 1 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s4_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Language I Chapter 2 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s4_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Language I Chapter 3 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_lang1_s4_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Language I Chapter 4 study material.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_s4_language_2",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s4_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s4_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s4_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials for Semester 4.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s4_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s4_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s4_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s4_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 5,
        "name": "Semester 5",
        "description": "Natural Language Processing, Time Series Forecasting, and Cloud Analytics",
        "status": "Locked",
        "modulesCount": 12,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ds_nlp",
            "name": "Natural Language Processing",
            "description": "Tokenizing preprocessors, syntax dictionaries, and deep embeddings.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Languages",
            "bgColor": "bg-fuchsia-50 text-fuchsia-800",
            "textColor": "text-fuchsia-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "dsnlp_u1",
                "number": "01",
                "name": "Unit 1: Text Parse",
                "description": "RegEx filters, tokens, word stemmers, and lemmatizers.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dsnlp_u2",
                "number": "02",
                "name": "Unit 2: Sequence Mappings",
                "description": "POS tagging models, chunking blocks, and named entity recognitions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dsnlp_u3",
                "number": "03",
                "name": "Unit 3: Word Weights",
                "description": "N-gram frequencies, TF-IDF representations, and word2vec dimensions.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dsnlp_u4",
                "number": "04",
                "name": "Unit 4: Transformers",
                "description": "Self-attention nodes, transformer blocks, and sentiment prediction.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_english_sem5",
            "name": "English (Language I)",
            "description": "Semester 5 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_eng_s5_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 5 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_eng_s5_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s5_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s5_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s5_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_lang2_sem5",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s5_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s5_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s5_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s5_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s5_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s5_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s5_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      },
      {
        "id": 6,
        "name": "Semester 6",
        "description": "Predictive Analytics and Capstone Project Work",
        "status": "Locked",
        "modulesCount": 8,
        "completedModules": 0,
        "progressPercent": 0,
        "borderClass": "border-outline-variant",
        "badgeBg": "bg-surface-variant text-on-surface-variant",
        "badgeText": "Locked",
        "icon": "Lock",
        "subjects": [
          {
            "id": "ds_predictive",
            "name": "Predictive Analytics",
            "description": "Trend ARIMA forecasting models, confusion matrix scores, and precision rates.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "TrendingUp",
            "bgColor": "bg-yellow-50 text-yellow-800",
            "textColor": "text-yellow-800",
            "progressPercent": 0,
            "units": [
              {
                "id": "dspd_u1",
                "number": "01",
                "name": "Unit 1: Forecasting Trend",
                "description": "ARIMA parameters, season spikes, and stationarity diagnostics.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspd_u2",
                "number": "02",
                "name": "Unit 2: Classification Bounds",
                "description": "Confusion matrices calculations, precision metrics, and recall scores.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspd_u3",
                "number": "03",
                "name": "Unit 3: Model validation",
                "description": "K-fold cross verification loops, overfitting detections, and tuning.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspd_u4",
                "number": "04",
                "name": "Unit 4: Deploy model",
                "description": "Lightweight API servers, live prediction streams, and models logging.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_project",
            "name": "Capstone Data Project",
            "description": "Define real analytics datasets targets, build pipeline architectures, and write documentation.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Advanced",
            "icon": "Workflow",
            "bgColor": "bg-[#fff2e1] text-[#95491a]",
            "textColor": "text-[#95491a]",
            "progressPercent": 0,
            "units": [
              {
                "id": "dspw_u1",
                "number": "01",
                "name": "Unit 1: Data Gathering",
                "description": "Parsing web tables, public feeds download, database extraction.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspw_u2",
                "number": "02",
                "name": "Unit 2: Model Training",
                "description": "Fitting algorithms, hyperparameter grid search, metric curves.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspw_u3",
                "number": "03",
                "name": "Unit 3: Visual App Dashboard",
                "description": "Integrate charts, deploy dashboard panels, build predictions UI.",
                "masteryPercent": 0,
                "status": "Locked"
              },
              {
                "id": "dspw_u4",
                "number": "04",
                "name": "Unit 4: Thesis Composing",
                "description": "Compose final dissertation files, report performance matrices.",
                "masteryPercent": 0,
                "status": "Locked"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_english_sem6",
            "name": "English (Language I)",
            "description": "Semester 6 English Language coursework, literature chapters, and grammar.",
            "modulesCount": 4,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-pink-50 text-pink-800",
            "textColor": "text-pink-800",
            "progressPercent": 0,
            "contentMode": "chapters",
            "textbooks": [],
            "units": [
              {
                "id": "ds_eng_s6_tb",
                "number": "00",
                "name": "Textbook",
                "description": "Semester 6 English Prescribed Reference Textbook",
                "masteryPercent": 0,
                "status": "In Progress",
                "kind": "textbook"
              },
              {
                "id": "ds_eng_s6_ch1",
                "number": "01",
                "name": "Chapter 1",
                "description": "Prose & Literature Analysis",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s6_ch2",
                "number": "02",
                "name": "Chapter 2",
                "description": "Grammar & Language Structure",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s6_ch3",
                "number": "03",
                "name": "Chapter 3",
                "description": "Reading Comprehension & Vocabulary",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              },
              {
                "id": "ds_eng_s6_ch4",
                "number": "04",
                "name": "Chapter 4",
                "description": "Professional Writing & Communication",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "chapter"
              }
            ],
            "materials": []
          },
          {
            "id": "ds_lang2_sem6",
            "name": "Language II",
            "description": "Kannada, Hindi, or Additional English language options.",
            "modulesCount": 3,
            "completedModules": 0,
            "difficulty": "Core",
            "icon": "Languages",
            "bgColor": "bg-purple-50 text-purple-800",
            "textColor": "text-purple-800",
            "progressPercent": 0,
            "contentMode": "languages",
            "textbooks": [],
            "units": [
              {
                "id": "ds_lang2_s6_kan",
                "number": "01",
                "name": "Kannada",
                "description": "Kannada textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_kan_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Kannada Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_kan_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Kannada Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Kannada Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_kan_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Kannada Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s6_hin",
                "number": "02",
                "name": "Hindi",
                "description": "Hindi textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_hin_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Hindi Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_hin_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Hindi Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Hindi Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_hin_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Hindi Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              },
              {
                "id": "ds_lang2_s6_ae",
                "number": "03",
                "name": "Additional English",
                "description": "Additional English textbook and chapter materials.",
                "masteryPercent": 0,
                "status": "Locked",
                "kind": "language",
                "children": [
                  {
                    "id": "ds_ae_s6_tb",
                    "number": "00",
                    "name": "Textbook",
                    "description": "Additional English Textbook",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "textbook"
                  },
                  {
                    "id": "ds_ae_s6_ch1",
                    "number": "01",
                    "name": "Poems",
                    "description": "Additional English Prescribed Poems & Literary Verses",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s6_ch2",
                    "number": "02",
                    "name": "Lessons",
                    "description": "Additional English Prescribed Lessons & Prose",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  },
                  {
                    "id": "ds_ae_s6_ch3",
                    "number": "03",
                    "name": "Essays",
                    "description": "Additional English Prescribed Essays & Composition",
                    "masteryPercent": 0,
                    "status": "Locked",
                    "kind": "chapter"
                  }
                ]
              }
            ],
            "materials": []
          }
        ]
      }
    ]
  }
];

export function ensureAllLanguageCardsExist(courses: Course[]): Course[] {
  return courses.map((course) => {
    const updatedSemesters = course.semesters.map((sem) => {
      const semNum = sem.id;
      let subjects = [...(sem.subjects || [])];

      // 1. English (Language I) Card
      let engIdx = subjects.findIndex((s) =>
        s.name.toLowerCase().includes("english") ||
        s.name.toLowerCase().includes("language i") ||
        s.name.toLowerCase().includes("language 1") ||
        s.id.includes("language_1") ||
        s.id.includes("english")
      );

      if (engIdx >= 0) {
        subjects[engIdx] = {
          ...subjects[engIdx],
          name: "English (Language I)",
          description: subjects[engIdx].description || `Semester ${semNum} English Language coursework and chapters.`,
          contentMode: "chapters",
          icon: "Languages",
          bgColor: subjects[engIdx].bgColor || "bg-pink-50 text-pink-800",
          textColor: subjects[engIdx].textColor || "text-pink-800",
        };
      } else {
        subjects.push({
          id: `${course.id}_english_sem${semNum}`,
          name: "English (Language I)",
          description: `Semester ${semNum} English Language coursework, literature chapters, and grammar.`,
          modulesCount: 4,
          completedModules: 0,
          difficulty: "Core",
          icon: "Languages",
          bgColor: "bg-pink-50 text-pink-800",
          textColor: "text-pink-800",
          progressPercent: 0,
          contentMode: "chapters",
          textbooks: [],
          units: [
            { id: `${course.id}_eng_s${semNum}_tb`, number: "00", name: "Textbook", description: `Semester ${semNum} English Prescribed Reference Textbook`, masteryPercent: 0, status: "In Progress", kind: "textbook" },
            { id: `${course.id}_eng_s${semNum}_ch1`, number: "01", name: "Chapter 1", description: "Prose & Literature Analysis", masteryPercent: 0, status: "Locked", kind: "chapter" },
            { id: `${course.id}_eng_s${semNum}_ch2`, number: "02", name: "Chapter 2", description: "Grammar & Language Structure", masteryPercent: 0, status: "Locked", kind: "chapter" },
            { id: `${course.id}_eng_s${semNum}_ch3`, number: "03", name: "Chapter 3", description: "Reading Comprehension & Vocabulary", masteryPercent: 0, status: "Locked", kind: "chapter" },
            { id: `${course.id}_eng_s${semNum}_ch4`, number: "04", name: "Chapter 4", description: "Professional Writing & Communication", masteryPercent: 0, status: "Locked", kind: "chapter" }
          ],
          materials: []
        });
      }

      // 2. Language II Card (Kannada, Hindi, Additional English)
      // Exactly 3 unit cards: Poems (01), Lessons (02), Essays (03), plus Textbook (00)
      let lang2Idx = subjects.findIndex((s) =>
        s.name.toLowerCase().includes("language ii") ||
        s.name.toLowerCase().includes("language 2") ||
        s.id.includes("language_2") ||
        s.id.includes("lang2")
      );

      const defaultLangOptions = [
        { code: "kan", name: "Kannada" },
        { code: "hin", name: "Hindi" },
        { code: "ae", name: "Additional English" }
      ];

      const makeLangChildren = (langCode: string, langName: string, existingChildren?: Unit[]): Unit[] => {
        const tbCard: Unit = existingChildren?.find(c => c.kind === "textbook" || c.name?.toLowerCase().includes("textbook")) || {
          id: `${course.id}_${langCode}_s${semNum}_tb`,
          number: "00",
          name: "Textbook",
          description: `${langName} Textbook`,
          masteryPercent: 0,
          status: "Locked",
          kind: "textbook"
        };

        const ch1 = existingChildren?.find(c => c.number === "01" || c.id?.includes("ch1") || c.name?.toLowerCase().includes("poem"));
        const ch2 = existingChildren?.find(c => c.number === "02" || c.id?.includes("ch2") || c.name?.toLowerCase().includes("lesson"));
        const ch3 = existingChildren?.find(c => c.number === "03" || c.id?.includes("ch3") || c.name?.toLowerCase().includes("essay"));

        const poemsCard: Unit = {
          ...(ch1 || {}),
          id: ch1?.id || `${course.id}_${langCode}_s${semNum}_poems`,
          number: "01",
          name: "Poems",
          description: ch1?.description && !ch1.description.includes("Chapter") ? ch1.description : `${langName} Prescribed Poems & Literary Verses`,
          masteryPercent: ch1?.masteryPercent || 0,
          status: ch1?.status || "Locked",
          kind: "chapter"
        };

        const lessonsCard: Unit = {
          ...(ch2 || {}),
          id: ch2?.id || `${course.id}_${langCode}_s${semNum}_lessons`,
          number: "02",
          name: "Lessons",
          description: ch2?.description && !ch2.description.includes("Chapter") ? ch2.description : `${langName} Prescribed Lessons & Prose`,
          masteryPercent: ch2?.masteryPercent || 0,
          status: ch2?.status || "Locked",
          kind: "chapter"
        };

        const essaysCard: Unit = {
          ...(ch3 || {}),
          id: ch3?.id || `${course.id}_${langCode}_s${semNum}_essays`,
          number: "03",
          name: "Essays",
          description: ch3?.description && !ch3.description.includes("Chapter") ? ch3.description : `${langName} Prescribed Essays & Composition`,
          masteryPercent: ch3?.masteryPercent || 0,
          status: ch3?.status || "Locked",
          kind: "chapter"
        };

        return [tbCard, poemsCard, lessonsCard, essaysCard];
      };

      if (lang2Idx >= 0) {
        const existingLang2 = subjects[lang2Idx];
        const existingUnits = existingLang2.units || [];
        
        const updatedUnits: Unit[] = defaultLangOptions.map((opt, idx) => {
          const foundUnit = existingUnits.find(u => 
            u.name.toLowerCase().includes(opt.name.toLowerCase()) || 
            u.id.includes(opt.code)
          );

          return {
            id: foundUnit?.id || `${course.id}_lang2_s${semNum}_${opt.code}`,
            number: foundUnit?.number || `0${idx + 1}`,
            name: foundUnit?.name || opt.name,
            description: foundUnit?.description || `${opt.name} textbook, poems, lessons, and essays.`,
            masteryPercent: foundUnit?.masteryPercent || 0,
            status: foundUnit?.status || "Locked",
            kind: "language",
            children: makeLangChildren(opt.code, opt.name, foundUnit?.children)
          };
        });

        subjects[lang2Idx] = {
          ...existingLang2,
          name: "Language II",
          description: "Kannada, Hindi, or Additional English language options.",
          contentMode: "languages",
          icon: "Languages",
          modulesCount: 3,
          bgColor: existingLang2.bgColor || "bg-purple-50 text-purple-800",
          textColor: existingLang2.textColor || "text-purple-800",
          units: updatedUnits
        };
      } else {
        subjects.push({
          id: `${course.id}_lang2_sem${semNum}`,
          name: "Language II",
          description: "Kannada, Hindi, or Additional English language options.",
          modulesCount: 3,
          completedModules: 0,
          difficulty: "Core",
          icon: "Languages",
          bgColor: "bg-purple-50 text-purple-800",
          textColor: "text-purple-800",
          progressPercent: 0,
          contentMode: "languages",
          textbooks: [],
          units: defaultLangOptions.map((opt, idx) => ({
            id: `${course.id}_lang2_s${semNum}_${opt.code}`,
            number: `0${idx + 1}`,
            name: opt.name,
            description: `${opt.name} textbook, poems, lessons, and essays.`,
            masteryPercent: 0,
            status: "Locked",
            kind: "language",
            children: makeLangChildren(opt.code, opt.name)
          })),
          materials: []
        });
      }

      return {
        ...sem,
        subjects
      };
    });

    return {
      ...course,
      semesters: updatedSemesters
    };
  });
}
