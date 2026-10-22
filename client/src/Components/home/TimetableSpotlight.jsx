import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import Reveal from './Reveal';

export default function TimetableSpotlight() {
  return (
    <section className="bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                University Portal Format
              </span>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                Authentic Campus <span className="text-blue-600">Timetable View</span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                Generate and view your semester schedule in the official portal format.
                View your courses, classroom codes, and faculty instructors mapped across standard
                1.5-hour lecture slots from Monday to Saturday.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    Day\Title matrix layout
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    Standard 1.5-hour lecture slots
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    Course, room code & teacher
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    One-click shareable link
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/student/create-timetable"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Build Your Timetable</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>

                <span className="text-xs text-slate-500 font-medium">
                  Matches Official CUOnline Portal Format
                </span>
              </div>
            </div>

            {/* Right Visual: Replica of the uploaded official table */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="rounded-2xl border border-slate-300 bg-white shadow-md overflow-hidden">
                  {/* Mock URL bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-[#f8fafc] px-4 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Share2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs font-mono text-slate-600 truncate">
                        https://campusconnect.app/timetable/7f3a9e2c
                      </span>
                    </div>
                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white shrink-0">
                      Live Share
                    </span>
                  </div>

                  {/* Micro Table formatted exactly like the screenshot */}
                  <div className="overflow-x-auto p-2">
                    <table className="w-full border-collapse text-left text-xs min-w-[540px]">
                      <thead>
                        <tr className="bg-[#f2f4f7] border border-slate-300">
                          <th className="border border-slate-300 px-2 py-1.5 font-bold text-slate-800 text-[11px] w-20 bg-[#edf0f4]">
                            Day\Title
                          </th>
                          <th className="border border-slate-300 px-1 py-1.5 text-center font-bold text-slate-700 text-[10px]">
                            09:00 To 10:30
                          </th>
                          <th className="border border-slate-300 px-1 py-1.5 text-center font-bold text-slate-700 text-[10px]">
                            10:30 To 12:00
                          </th>
                          <th className="border border-slate-300 px-1 py-1.5 text-center font-bold text-slate-700 text-[10px]">
                            12:00 To 13:30
                          </th>
                          <th className="border border-slate-300 px-1 py-1.5 text-center font-bold text-slate-700 text-[10px]">
                            13:30 To 15:00
                          </th>
                          <th className="border border-slate-300 px-1 py-1.5 text-center font-bold text-slate-700 text-[10px]">
                            15:00 To 16:30
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border border-slate-300">
                          <td className="border border-slate-300 bg-[#f9fafb] px-2 py-1.5 font-bold text-slate-800 text-[11px]">
                            Monday
                          </td>
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Web Technologies
                            </span>
                            <span className="block text-[9.5px] text-slate-500">S105 (52M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Bushra Mushtaq
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white" />
                        </tr>

                        <tr className="border border-slate-300">
                          <td className="border border-slate-300 bg-[#f9fafb] px-2 py-1.5 font-bold text-slate-800 text-[11px]">
                            Tuesday
                          </td>
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Intro to Psychology
                            </span>
                            <span className="block text-[9.5px] text-slate-500">S207 (56M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Mina Shah (VF)
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Business Process Eng
                            </span>
                            <span className="block text-[9.5px] text-slate-500">S313 (40M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Mukhtiar Zamin
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Information Security
                            </span>
                            <span className="block text-[9.5px] text-slate-500">S206 (56M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              M. Ahmed Mustafa
                            </span>
                          </td>
                        </tr>

                        <tr className="border border-slate-300">
                          <td className="border border-slate-300 bg-[#f9fafb] px-2 py-1.5 font-bold text-slate-800 text-[11px]">
                            Wednesday
                          </td>
                          <td className="border border-slate-300 p-1 bg-white" />
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Information Security
                            </span>
                            <span className="block text-[9.5px] text-slate-500">S101(45M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              M. Ahmed Mustafa
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Machine Learning
                            </span>
                            <span className="block text-[9.5px] text-slate-500">C106 (50M)</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Sara Shafique
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Web Technologies
                            </span>
                            <span className="block text-[9.5px] text-slate-500">Computer LAB 06</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Bushra Mushtaq
                            </span>
                          </td>
                          <td className="border border-slate-300 p-1 bg-white">
                            <span className="block font-medium text-slate-900 text-[10.5px] leading-tight">
                              Web Technologies
                            </span>
                            <span className="block text-[9.5px] text-slate-500">Computer LAB 06</span>
                            <span className="block text-[10px] font-semibold text-[#0033cc]">
                              Bushra Mushtaq
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 bg-[#f8fafc] px-4 py-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      COMSATS CUOnline official layout
                    </span>
                    <span className="font-semibold text-blue-600">8 time slots · 6 days</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
