import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'What areas in Rahim Yar Khan do you deliver building materials to?',
      a: 'We deliver materials across Rahim Yar Khan City, Manthar Road, Sadiqabad, Khanpur, Liaquatpur, and nearby industrial and rural developments.'
    },
    {
      q: 'How are bulk materials like sand, crush, and bricks delivered?',
      a: 'Bulk aggregates like River Chenab sand and Margalla crushed stone are delivered by hydraulic tipper dumper or tractor trolley. Bricks are delivered via truck or trolley for on-site manual offloading.'
    },
    {
      q: 'Why are some products listed with "Price on Request" instead of fixed prices?',
      a: 'Prices for commodities such as steel rebar (sarya), river sand, crushed aggregates, and kiln bricks fluctuate according to daily mill and quarry costs. Rather than presenting outdated pricing, we provide real-time quotations.'
    },
    {
      q: 'Can contractors open credit or project supply accounts?',
      a: 'Yes, registered contractors and project builders can apply through our Bulk Procurement form or contact store management directly to arrange project terms.'
    },
    {
      q: 'What is your return policy for unused materials?',
      a: 'Unused, undamaged materials in unopened original packaging (such as tile boxes, hardware locks, tools) may be returned within 7 days with the original sales invoice. Custom mixed paint shades and customized cut steel bars are non-returnable.'
    },
    {
      q: 'Do you offer Cash on Delivery?',
      a: 'Yes, Cash on Delivery (COD) is available for local residential and site orders. You can inspect the delivery on site before completing payment to the vehicle driver.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <SEO title="Frequently Asked Questions (FAQs)" description="Common questions about building materials ordering, delivery, and payments in Rahim Yar Khan." />

      <div className="text-center max-w-lg mx-auto space-y-2">
        <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">Help &amp; Guidance</span>
        <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-gray-500">
          Find answers regarding building materials delivery, bulk quotations, and order terms.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="transition-colors">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 hover:text-[#F28C28]"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#F28C28]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
