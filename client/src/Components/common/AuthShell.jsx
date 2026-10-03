import { GraduationCap } from 'lucide-react';

import loginBackground from '../../assets/login_bg.png';

/*
 * Palette sampled from the `login_bg.png` mockup so every auth page matches it:
 *   navy (headings, wordmark, labels) ... #0b2570
 *   muted copy ......................... #5d76a9
 *   placeholder text ................... #9aa8c2
 *   brand blue (CTA, links, icons) ..... #1869f2   hover #1559d6
 *   field hairline ..................... #e2e9f6
 *   "or" divider ....................... #e6ebf5
 */

/**
 * Shared field styling: the 52px rhythm and soft blue focus ring used across
 * the portal. Right padding is added per field so the password row can make
 * room for the show/hide toggle.
 */
export const FIELD_CLASS =
  'h-[42px] w-full rounded-[9px] border border-[#e2e9f6] bg-white pl-10 text-[13.5px] text-[#16305f] outline-none transition placeholder:text-[#9aa8c2] focus:border-[#1869f2] focus:ring-4 focus:ring-[#1869f2]/10 [@media(min-height:820px)]:h-[46px] [@media(min-height:820px)]:text-[14px]';

/** Decorative leading icon inside each field. */
export const FIELD_ICON_CLASS =
  'pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8ea0c4]';

/** Field heading shared by every input. */
export const LABEL_CLASS =
  'mb-1.5 block text-[13px] font-semibold text-[#0b2570] [@media(min-height:820px)]:text-[13.5px]';

/** Primary call-to-action button shared by sign-in, sign-up and reset forms. */
export const PRIMARY_BUTTON_CLASS =
  'flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#1869f2] text-[14px] font-semibold text-white shadow-[0_18px_32px_-16px_rgba(24,105,242,0.9)] transition hover:bg-[#1559d6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1869f2]/25 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70 [@media(min-height:820px)]:h-[50px] [@media(min-height:820px)]:text-[15px]';

/**
 * Card shell. `max-h-full` plus the scrollbar-hidden overflow keep the whole
 * form inside the viewport on short windows, so the page itself never grows a
 * scrollbar, which is the contract of a full-window mockup.
 */
const CARD_CLASS =
  'animate-fadeInUp flex max-h-full w-full max-w-[26rem] flex-col overflow-y-auto overscroll-contain rounded-[20px] border border-white/80 bg-white/95 px-6 py-6 shadow-[0_30px_70px_-30px_rgba(16,44,100,0.35)] backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 sm:py-7 [&::-webkit-scrollbar]:hidden [@media(min-height:820px)]:rounded-[22px]';

/**
 * The full-window frame shared by every student auth screen (sign in, sign up,
 * forgot password, reset password). It renders the artwork, the small-screen
 * scrim, the right-aligned card and the CampusConnect brand header, then hands
 * the rest of the card to `children`.
 *
 * Keeping this in one place is what guarantees the forgot/reset screens look
 * exactly like the login screen.
 *
 * @param {object} props
 * @param {string} props.subtitle  The line under the "CampusConnect" wordmark.
 * @param {React.ReactNode} props.children  Card body rendered below the header.
 */
export default function AuthShell({ subtitle, children }) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#f5f9ff]">
      {/*
        Full-window artwork. `login_bg.png` is the finished mockup: the brand
        story (wordmark, students, tagline) owns the left half while the right
        half is left deliberately empty for this card.

        Below `lg` it covers the window (the card sits centred over a softened
        copy). From `lg` up it switches to `object-contain`, which scales the
        whole drawing down to fit inside the window so nothing is cropped — a
        plain `object-cover` zoomed in and sliced the wordmark off on widescreen
        monitors. It stays pinned left, so the spare space lands on the mockup's
        own pale, empty half where the card sits.
      */}
      <img
        src={loginBackground}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-left lg:object-contain"
      />

      {/*
        Below `lg` the card is centred on the artwork, so it is softened first to
        keep the form readable.
      */}
      <div className="pointer-events-none absolute inset-0 bg-[#f5f9ff]/80 backdrop-blur-[2px] lg:hidden" />

      {/*
        Form layer: centred on small screens, parked on the artwork's blank right
        half from `lg` up. `overflow-hidden` here, together with `max-h-full` on
        the card, is what guarantees the page never grows a scrollbar.
      */}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden px-4 py-4 sm:px-8 lg:justify-end lg:pr-[4%] xl:pr-[7%] 2xl:pr-[10%]">
        <div className={CARD_CLASS}>
          {/* Card header */}
          <div className="flex items-center justify-center gap-3">
            <GraduationCap
              className="h-7 w-7 shrink-0 text-[#1869f2] [@media(min-height:820px)]:h-8 [@media(min-height:820px)]:w-8"
              strokeWidth={1.8}
            />
            <span className="leading-tight">
              <span className="block text-[19px] font-extrabold tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[21px]">
                CampusConnect
              </span>
              <span className="block text-[12px] font-medium text-[#5d76a9] [@media(min-height:820px)]:text-[13px]">
                {subtitle}
              </span>
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
