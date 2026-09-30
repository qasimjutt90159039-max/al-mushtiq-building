import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, Truck, Layers, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <SEO
        title="About Al Mushtaq Building Material Store"
        description="Local building material and hardware supplier based at Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan."
      />

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
          Local Construction Supplies Depot
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          About Al Mushtaq Building Material Store
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Serving home builders, civil contractors, tradespeople, and property owners in Rahim Yar Khan with dependable construction materials and hardware.
        </p>
      </div>

      {/* Main Story & Purpose */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-gray-900">
          Your Dedicated Building Materials Partner in Rahim Yar Khan
        </h2>

        <p>
          Al Mushtaq Building Material Store operates as a direct supplier of core civil materials, plumbing infrastructure, architectural finishes, and hardware tools located at Basti Manzoorabad Pull on Manthar Road, Rahim Yar Khan.
        </p>

        <p>
          We focus on stocking verified building materials essential for every phase of construction:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-[#F28C28]">
              Structural &amp; Civil Materials
            </h3>
            <p className="text-xs text-gray-600">
              Ordinary Portland Cement (OPC), kiln-burned red clay bricks, concrete masonry blocks, ASTM Grade 60 deformed rebar steel, washed River Chenab sand, and Margalla crushed aggregates.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-[#F28C28]">
              Finishing &amp; Architectural Surfaces
            </h3>
            <p className="text-xs text-gray-600">
              Vitrified porcelain floor slabs, ceramic bathroom tiles, weather-shield exterior emulsions, luxury interior wash-resistant wall paints, and tile joint sealants.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-[#F28C28]">
              Sanitary &amp; Water Management
            </h3>
            <p className="text-xs text-gray-600">
              Class B uPVC sewer lines, PN20 heat fusion PPR hot &amp; cold water pipes, forged brass ball valves, chrome fixtures, and overhead food-grade water storage tanks.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-[#F28C28]">
              Electrical &amp; Contractor Tools
            </h3>
            <p className="text-xs text-gray-600">
              Pure copper single and multi-core wiring, circuit breakers, conduit piping, claw hammers, diamond cutting discs, and heavy-duty gate padlocks.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Contact Notice */}
      <div className="bg-[#17191C] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#28323A]">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Yard Location</span>
          <h3 className="font-display text-xl font-bold">Visit Our Depot in Rahim Yar Khan</h3>
          <p className="text-xs text-gray-300">
            Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan
          </p>
          <p className="text-xs text-gray-400">
            Open Monday to Saturday: 8:00 AM – 8:00 PM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="tel:+923013242408"
            className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call +92 301 3242408</span>
          </a>

          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#28323A] hover:bg-[#323e48] border border-gray-600 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Contact Store
          </Link>
        </div>
      </div>
    </div>
  );
};
