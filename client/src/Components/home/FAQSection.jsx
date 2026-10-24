import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Reveal from './Reveal';

const FAQS = [
  {
    question: 'Is UniMate completely free to use?',
    answer:
      'Yes, UniMate is 100% free and open for all students. There are no paywalls, hidden fees, or subscription tiers. Everything is built to support the student community.',
  },
  {
    question: 'How does the Smart Timetable Generator work?',
    answer:
      'Simply navigate to the Create Timetable page, set your preferred class hours, pick days off (such as Saturday and Sunday), and list your subjects. The system automatically creates a balanced schedule with a unique sharing link that your classmates can visit directly.',
  },
  {
    question: 'Who uploads and verifies the past papers and study materials?',
    answer:
      'Materials are uploaded by enrolled students, seniors, and course toppers. Uploads include course tags, semester numbers, and departments so students can find the exact exam patterns for their sessions.',
  },
  {
    question: 'Can I upload and showcase my semester projects or source code?',
    answer:
      'Absolutely! You can upload project documentation, architecture diagrams, and link directly to public GitHub repositories so your peers can learn from your implementation and you can build an academic portfolio.',
  },
  {
    question: 'Are teacher reviews and ratings anonymous?',
    answer:
      'Yes, teacher reviews are completely private and focused on constructive course feedback (teaching methodology, grading clarity, and exam relevance) to help fellow students make informed elective selections.',
  },
  {
    question: 'Do I need to sign up to view resources?',
    answer:
      'You can freely search and preview resources as a guest visitor. Creating a free student account allows you to download files, save bookmarks, upload your own materials, and create customized schedules.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Got Questions? <span className="text-blue-600">We Have Answers.</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Everything you need to know about navigating and benefiting from the UniMate ecosystem.
          </p>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 40}>
                <div
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-blue-300 bg-blue-50/20 '
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 border-blue-200 bg-blue-50 text-blue-600'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100/60 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

